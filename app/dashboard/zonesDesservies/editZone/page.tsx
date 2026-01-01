'use client';

import React, { useEffect, useState } from 'react';
import { ICenter } from '@/model/centerModel';
import { Pencil, Trash2, ChevronDown, ChevronUp, PlusCircle, Save, X, Search } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'react-toastify';

// Import your 4 editable components
import ZoneDesserviesVerifie from '@/components/zonesDesservies/zonesDesserviesVerifie';
import ZoneDesserviesCombien from '@/components/zonesDesservies/zonesDesserviesCombien';
import ZoneDesserviesComment from '@/components/zonesDesservies/zonesDesserviesCombien';
import ZoneDesserviesFAQ from '@/components/zonesDesservies/zonesDesserviesFAQ';

interface IZoneDesservie {
  _id: string;
  city: string;
  centers: ICenter[];
  verifySection?: any;
  combienSection?: any;
  commentSection?: any;
  faqSection?: any;
  createdAt: string;
  updatedAt: string;
}

export default function ZonesDesserviesPage() {
  const [expandedRows, setExpandedRows] = useState<string[]>([]);
  const [zonesData, setZonesData] = useState<IZoneDesservie[]>([]);
  const [zoneEdit, setZoneEdit] = useState<IZoneDesservie | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [centers, setCenters] = useState<ICenter[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchZones = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/v1/zonesDesservies');
      if (!response.ok) throw new Error('Failed to fetch zones');
      const data = await response.json();
      setZonesData(data.data || []);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Impossible de charger les zones desservies.');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCenters = async () => {
    try {
      const res = await fetch('/api/v1/center');
      if (res.ok) {
        const data = await res.json();
        setCenters(data.data || []);
      }
    } catch (err) {
      console.error('Failed to load centers', err);
    }
  };

  useEffect(() => {
    fetchZones();
    fetchCenters();
  }, []);

  const toggleRow = (city: string) => {
    setExpandedRows((prev) =>
      prev.includes(city) ? prev.filter((id) => id !== city) : [...prev, city]
    );
  };

  const handleEditClick = (zone: IZoneDesservie) => {
    toggleRow(zone.city);
    setZoneEdit({ ...zone }); // Full zone with all sections
  };

  const toggleCenterInEdit = (centerId: string) => {
    if (!zoneEdit) return;
    const exists = zoneEdit.centers.some((c) => c._id === centerId);
    const newCenters = exists
      ? zoneEdit.centers.filter((c) => c._id !== centerId)
      : [...zoneEdit.centers, centers.find((c) => c._id === centerId)!].filter(Boolean);

    setZoneEdit({ ...zoneEdit, centers: newCenters });
  };

  const handleSaveEdit = async () => {
    if (!zoneEdit) return;

    const loadingToastId = toast.loading('Sauvegarde en cours...');

    try {
      const res = await fetch(`/api/v1/zonesDesservies/update/${zoneEdit._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          city: zoneEdit.city,
          centers: zoneEdit.centers.map((c) => c._id),
          verifySection: zoneEdit.verifySection,
          combienSection: zoneEdit.combienSection,
          commentSection: zoneEdit.commentSection,
          faqSection: zoneEdit.faqSection,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Erreur');
      }

      toast.update(loadingToastId, {
        render: `Zone "${zoneEdit.city}" mise à jour avec succès !`,
        type: 'success',
        isLoading: false,
        autoClose: 4000,
      });

      fetchZones();
      setZoneEdit(null);
    } catch (error: any) {
      toast.update(loadingToastId, {
        render: error.message || 'Erreur lors de la sauvegarde',
        type: 'error',
        isLoading: false,
        autoClose: 5000,
      });
    }
  };

  const handleCancelEdit = () => {
    setZoneEdit(null);
  };

  const handleDelete = async (zone: IZoneDesservie) => {
    if (!confirm(`Supprimer définitivement "${zone.city}" ?`)) return;

    const loadingToastId = toast.loading('Suppression...');
    try {
      const res = await fetch(`/api/v1/zonesDesservies/delete/${zone._id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Échec suppression');

      toast.update(loadingToastId, {
        render: `Zone "${zone.city}" supprimée`,
        type: 'success',
        isLoading: false,
        autoClose: 3000,
      });
      fetchZones();
    } catch (error: any) {
      toast.update(loadingToastId, {
        render: error.message || 'Erreur',
        type: 'error',
        isLoading: false,
        autoClose: 4000,
      });
    }
  };

  const filteredCenters = centers.filter(
    (c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.city.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-200 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-8 gap-4">
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900">
            Zones Desservies
          </h1>
          <Link
            href="/dashboard/zonesDesservies/createZone"
            className="flex items-center justify-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition"
          >
            <PlusCircle className="w-5 h-5 mr-2" />
            Ajouter une Zone
          </Link>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Chargement des zones...</p>
            </div>
          ) : zonesData.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 mb-6">Aucune zone desservie</p>
              <Link
                href="/dashboard/zonesDesservies/createZone"
                className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800"
              >
                <PlusCircle className="w-5 h-5" />
                Créer la première zone
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {zonesData.map((zone) => {
                const isEditing = zoneEdit?._id === zone._id;
                const displayZone = isEditing ? zoneEdit! : zone;

                return (
                  <div key={zone._id} className="border-b border-gray-200 last:border-0">
                    {/* Compact Row */}
                    <div className="grid grid-cols-12 items-center px-6 py-5 hover:bg-gray-50 transition">
                      {/* City */}
                      <div className="col-span-3 font-bold text-lg">
                        {isEditing ? (
                          <input
                            value={zoneEdit.city}
                            onChange={(e) => setZoneEdit({ ...zoneEdit, city: e.target.value })}
                            className="px-3 py-2 border rounded-lg w-full"
                            placeholder="Ville"
                          />
                        ) : (
                          zone.city
                        )}
                      </div>

                      {/* Centers Count */}
                      <div className="col-span-3 text-center">
                        <span className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 text-blue-800 font-bold text-lg">
                          {displayZone.centers.length}
                        </span>
                      </div>

                      {/* Actions */}
                      <div className="col-span-4 text-center space-x-3">
                        {isEditing ? (
                          <>
                            <button
                              onClick={handleSaveEdit}
                              className="bg-green-600 hover:text-green-200 font-medium text-white p-1 rounded-lg"
                            >
                              <Save className="w-5 h-5 inline" /> Sauvegarder
                            </button>
                            <button
                              onClick={handleCancelEdit}
                              className="bg-red-600 hover:text-red-200 font-medium text-white p-1 rounded-lg"
                            >
                              <X className="w-5 h-5 inline" /> Annuler
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => handleEditClick(zone)}
                              className="text-white hover:text-blue-700 bg-blue-500 p-1 rounded-lg"
                            >
                              <Pencil className="w-5 h-5" />
                            </button>
                            <button
                              onClick={() => handleDelete(zone)}
                              className="text-white hover:text-red-700 bg-red-500 rounded-lg p-1"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </>
                        )}
                      </div>

                      {/* Expand */}
                      <div className="col-span-2 text-right">
                        <button
                          onClick={() => toggleRow(zone.city)}
                          className="text-gray-600 hover:text-gray-800"
                        >
                          {expandedRows.includes(zone.city) ? (
                            <ChevronUp className="w-6 h-6" />
                          ) : (
                            <ChevronDown className="w-6 h-6" />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Expanded Content */}
                    {expandedRows.includes(zone.city) && (
                      <div className="bg-gray-50 border-t border-gray-200 px-6 py-8">
                        {/* Centers List */}
                        <div className="mb-8">
                          <h3 className="font-bold text-lg mb-4">Centres associés</h3>
                          {isEditing ? (
                            <>
                              <div className="relative mb-4">
                                <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                                <input
                                  type="text"
                                  value={searchTerm}
                                  onChange={(e) => setSearchTerm(e.target.value)}
                                  placeholder="Rechercher un centre..."
                                  className="w-full pl-10 pr-4 py-3 border rounded-lg"
                                />
                              </div>
                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-96 overflow-y-auto">
                                {filteredCenters.map((center) => {
                                  const isSelected = displayZone.centers.some((c) => c._id === center._id);
                                  return (
                                    <div
                                      key={center._id}
                                      onClick={() => toggleCenterInEdit(center._id)}
                                      className={`p-4 rounded-lg border-2 cursor-pointer transition ${
                                        isSelected
                                          ? 'border-blue-500 bg-blue-50'
                                          : 'border-gray-200 hover:border-gray-400'
                                      }`}
                                    >
                                      <div className="font-medium">{center.name}</div>
                                      <div className="text-sm text-gray-600">{center.city}</div>
                                    </div>
                                  );
                                })}
                              </div>
                            </>
                          ) : (
                            <div className="flex flex-wrap gap-2">
                              {displayZone.centers.map((c) => (
                                <span
                                  key={c._id}
                                  className="px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm"
                                >
                                  {c.name}
                                </span>
                              ))}
                              <div className="space-y-16">
                              <div>
                                <h3 className="text-xl font-bold mb-6 text-blue-700">
                                  1. Que vérifie-t-on ? (verifySection)
                                </h3>
                                <ZoneDesserviesVerifie
                                  initialData={displayZone.verifySection}
                                  
                                  
                                />
                              </div>

                              <div>
                                <h3 className="text-xl font-bold mb-6 text-purple-700">
                                  2. Combien ça coûte ? (combienSection)
                                </h3>
                                <ZoneDesserviesCombien
                                  initialData={displayZone.combienSection}
                                  
                                />
                              </div>

                              <div>
                                <h3 className="text-xl font-bold mb-6 text-cyan-700">
                                  3. Comment ça se passe ? (commentSection)
                                </h3>
                                <ZoneDesserviesComment
                                  initialData={displayZone.commentSection}
                                  
                                />
                              </div>

                              <div>
                                <h3 className="text-xl font-bold mb-6 text-teal-700">
                                  4. FAQ (faqSection)
                                </h3>
                                <ZoneDesserviesFAQ
                                  initialData={displayZone.faqSection}
                                 
                                />
                              </div>
                            </div>
                            </div>
                          )}
                        </div>

                        {/* === ALL 4 EDITABLE SECTIONS === */}
                        {isEditing && zoneEdit && (
                          <div className="space-y-12 mt-10 pt-8 border-t-4 border-dashed border-gray-300">
                            <h2 className="text-2xl font-bold text-center mb-8">
                              Édition du contenu de la page
                            </h2>

                            <div className="space-y-16">
                              <div>
                                <h3 className="text-xl font-bold mb-6 text-blue-700">
                                  1. Que vérifie-t-on ? (verifySection)
                                </h3>
                                <ZoneDesserviesVerifie
                                  initialData={zoneEdit.verifySection}
                                  isEditable={true}
                                  onSave={(data) => setZoneEdit({ ...zoneEdit, verifySection: data })}
                                />
                              </div>

                              <div>
                                <h3 className="text-xl font-bold mb-6 text-purple-700">
                                  2. Combien ça coûte ? (combienSection)
                                </h3>
                                <ZoneDesserviesCombien
                                  initialData={zoneEdit.combienSection}
                                  isEditable={true}
                                  onSave={(data) => setZoneEdit({ ...zoneEdit, combienSection: data })}
                                />
                              </div>

                              <div>
                                <h3 className="text-xl font-bold mb-6 text-cyan-700">
                                  3. Comment ça se passe ? (commentSection)
                                </h3>
                                <ZoneDesserviesComment
                                  initialData={zoneEdit.commentSection}
                                  isEditable={true}
                                  onSave={(data) => setZoneEdit({ ...zoneEdit, commentSection: data })}
                                />
                              </div>

                              <div>
                                <h3 className="text-xl font-bold mb-6 text-teal-700">
                                  4. FAQ (faqSection)
                                </h3>
                                <ZoneDesserviesFAQ
                                  initialData={zoneEdit.faqSection}
                                  isEditable={true}
                                  onSave={(data) => setZoneEdit({ ...zoneEdit, faqSection: data })}
                                />
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}