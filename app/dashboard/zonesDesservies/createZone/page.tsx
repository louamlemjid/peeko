'use client';

import React, { useState, useEffect } from 'react';
import { PlusCircle, Search, X } from 'lucide-react';
import { toast } from 'react-toastify';
import { ICenter } from '@/model/centerModel';


interface FormData {
  city: string;
  centerIds: string[]; // Liste des IDs sélectionnés
}

export default function CreateZoneDesservie() {
  const [formData, setFormData] = useState<FormData>({
    city: '',
    centerIds: [],
  });

  const [centers, setCenters] = useState<ICenter[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Charger tous les centres au montage
  useEffect(() => {
    const fetchCenters = async () => {
      setLoading(true);
      try {
        const res = await fetch('/api/v1/center');
        if (res.ok) {
          const data = await res.json();
          setCenters(data.data || []);
        } else {
          toast.error('Impossible de charger les centres.');
        }
      } catch (err) {
        console.error(err);
        toast.error('Erreur réseau.');
      } finally {
        setLoading(false);
      }
    };

    fetchCenters();
  }, []);

  // Filtrer les centres selon la recherche
  const filteredCenters = centers.filter(
    (center) =>
      center.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      center.city.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Gérer la sélection d'un centre
  const toggleCenter = (centerId: string) => {
    setFormData((prev) => ({
      ...prev,
      centerIds: prev.centerIds.includes(centerId)
        ? prev.centerIds.filter((id) => id !== centerId)
        : [...prev.centerIds, centerId],
    }));
  };

  // Supprimer un centre sélectionné
  const removeCenter = (centerId: string) => {
    setFormData((prev) => ({
      ...prev,
      centerIds: prev.centerIds.filter((id) => id !== centerId),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    if (!formData.city.trim()) {
      toast.error('La ville est obligatoire.');
      setSubmitting(false);
      return;
    }

    if (formData.centerIds.length === 0) {
      toast.error('Sélectionnez au moins un centre.');
      setSubmitting(false);
      return;
    }

    const loadingToastId = toast.loading('Création de la zone desservie...');

    try {
      const res = await fetch('/api/v1/zonesDesservies/new', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          city: formData.city.trim(),
          centers: formData.centerIds,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        toast.update(loadingToastId, {
          render: `Zone "${data.data.city}" créée avec succès !`,
          type: 'success',
          isLoading: false,
          autoClose: 3000,
        });

        // Reset
        setFormData({ city: '', centerIds: [] });
        setSearchTerm('');
      } else {
        const error = await res.json();
        toast.update(loadingToastId, {
          render: error.error || 'Erreur lors de la création.',
          type: 'error',
          isLoading: false,
          autoClose: 4000,
        });
      }
    } catch (err) {
      console.error(err);
      toast.update(loadingToastId, {
        render: 'Erreur de connexion au serveur.',
        type: 'error',
        isLoading: false,
        autoClose: 4000,
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="max-w-5xl mx-auto p-8 bg-white rounded-2xl shadow-lg mb-20 sm:mt-4">
      <h1 className="text-3xl md:text-4xl font-extrabold mb-8 text-gray-900 flex items-center gap-3">
        <PlusCircle className="w-8 h-8 text-blue-600" />
        Créer une Zone Desservie
      </h1>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Ville */}
        <div>
          <label htmlFor="city" className="block text-sm font-semibold text-gray-700 mb-2">
            Ville <span className="text-red-500">*</span>
          </label>
          <input
            id="city"
            type="text"
            value={formData.city}
            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
            required
            placeholder="Ex: Toulouse"
            className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-300 transition"
          />
          <p className="text-xs text-gray-500 mt-1">Doit être unique.</p>
        </div>

        {/* Recherche de centres */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Centres associés <span className="text-red-500">*</span>
          </label>

          <div className="relative mb-4">
            <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Rechercher un centre par nom ou ville..."
              className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-300 transition"
            />
          </div>

          {/* Liste des centres disponibles */}
          <div className="max-h-64 overflow-y-auto border border-gray-200 rounded-lg p-2 bg-gray-50">
            {loading ? (
              <p className="text-center text-gray-500 py-4">Chargement des centres...</p>
            ) : filteredCenters.length === 0 ? (
              <p className="text-center text-gray-500 py-4">Aucun centre trouvé.</p>
            ) : (
              
              filteredCenters.map((center) => {
                const isSelected = formData.centerIds.includes(center._id);
                return (
                  <div
                    key={center._id}
                    onClick={() => toggleCenter(center._id)}
                    className={`p-3 rounded-md mb-2 cursor-pointer transition ${
                      isSelected
                        ? 'bg-blue-600 text-white'
                        : 'bg-white hover:bg-gray-100 border border-gray-200'
                    }`}
                  >
                    <div className="font-medium">{center.name}</div>
                    <div className={`text-sm ${isSelected ? 'text-blue-100' : 'text-gray-500'}`}>
                      {center.city}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Centres sélectionnés */}
        {formData.centerIds.length > 0 && (
          <div>
            <p className="text-sm font-semibold text-gray-700 mb-2">
              Centres sélectionnés ({formData.centerIds.length})
            </p>
            <div className="flex flex-wrap gap-2">
              {formData.centerIds.map((id) => {
                const center = centers.find((c) => c._id === id);
                if (!center) return null;
                return (
                  <span
                    key={id}
                    className="inline-flex items-center gap-1 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                  >
                    {center.name}
                    <button
                      type="button"
                      onClick={() => removeCenter(id)}
                      className="ml-1 hover:text-blue-900"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </span>
                );
              })}
            </div>
          </div>
        )}

        {/* Bouton de soumission */}
        <button
          type="submit"
          disabled={submitting || formData.centerIds.length === 0}
          className="w-full py-4 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed text-white text-lg font-semibold shadow-lg transition"
        >
          {submitting ? 'Création en cours...' : 'Créer la Zone Desservie'}
        </button>
      </form>
    </main>
  );
}