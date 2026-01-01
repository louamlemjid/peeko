'use client';
import { useState } from "react";
import { Save, ArrowLeft, PlusCircle, Trash2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { IBlog } from "@/model/blogModel";
import { toast } from 'react-toastify';
import { useRouter } from "next/navigation";
import { UploadButton } from "@/utils/uploadthing";

export default function CreateBlogPage() {
  const router = useRouter();
  const [form, setForm] = useState<Omit<IBlog, '_id' | 'createdAt' | 'updatedAt' | 'views'>>({
    title: "",
    description: "",
    blogSlug: "",
    imageUrl: "",
    content: [{ subTitle: "", text: "" }],
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  type ChangeArg = React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | {
    name: string;
    value: string | number;
  };

  const handleSimpleChange = (e: ChangeArg) => {
    if ('target' in e) {
      const { name, value } = e.target;
      setForm(prev => ({ ...prev, [name]: value }));
    } else {
      setForm(prev => ({ ...prev, [e.name]: e.value }));
    }
  };

  const handleContentChange = (index: number, e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      content: prev.content.map((block, i) =>
        i === index ? { ...block, [name]: value } : block
      )
    }));
  };

  const addContentBlock = () => {
    setForm(prev => ({
      ...prev,
      content: [...prev.content, { subTitle: '', text: '' }]
    }));
  };

  const removeContentBlock = (index: number) => {
    if (form.content.length <= 1) {
      toast.warn('Au moins une section requise');
      return;
    }
    setForm(prev => ({
      ...prev,
      content: prev.content.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.description.trim()) {
      toast.error('Titre et description requis');
      return;
    }

    setIsSubmitting(true);
    const loadingToastId = toast.loading('Création en cours...');

    try {
      const response = await fetch('/api/v1/blog', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Échec de la création');
      }

      toast.update(loadingToastId, {
        render: "Article créé avec succès !",
        type: 'success',
        isLoading: false,
        autoClose: 3000,
      });

      setForm({
        title: '', description: '', blogSlug: '', imageUrl: '',
        content: [{ subTitle: '', text: '' }]
      });
      router.push('/dashboard/blog/editBlog');
    } catch (error: unknown) {
      toast.update(loadingToastId, {
        render: `Erreur: ${error as string}`,
        type: 'error',
        isLoading: false,
        autoClose: 5000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Fixed Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/dashboard/blog/editBlog">
                <button className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition">
                  <ArrowLeft size={20} />
                  <span className="font-medium">Retour</span>
                </button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Nouvel Article</h1>
                <p className="text-sm text-gray-500">Rédigez et publiez votre contenu</p>
              </div>
            </div>
            <button
              type="submit"
              form="blogForm"
              disabled={isSubmitting}
              className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-medium rounded-lg hover:shadow-lg transition disabled:opacity-50"
            >
              {isSubmitting ? (
                <>Création...</>
              ) : (
                <>
                  <Save size={18} />
                  Publier
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <form id="blogForm" onSubmit={handleSubmit} className="space-y-8">
          {/* Main Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-8 space-y-8">
              {/* Basic Info */}
              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                    <Save className="w-5 h-5 text-white" />
                  </div>
                  Informations principales
                </h2>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Titre de l&apos;article *</label>
                    <input
                      name="title"
                      type="text"
                      required
                      value={form.title}
                      onChange={handleSimpleChange}
                      placeholder="Un titre captivant qui donne envie de cliquer..."
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
                    <textarea
                      name="description"
                      required
                      rows={3}
                      value={form.description}
                      onChange={handleSimpleChange}
                      placeholder="Résumé court et percutant de votre article (SEO + accroche)"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none transition"
                    />
                  </div>

                  {/* Image Upload */}
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-3">Image à la une</label>
                    <div className="space-y-4">
                      <UploadButton
                            endpoint="imageUploader"
                            onClientUploadComplete={(res) => {
                              // Do something with the response
                              console.log("Files: ", res);
                              setForm(prev=>({ ...prev,imageUrl: res[0].ufsUrl}) );
                              toast.success("Image téléchargée avec succes !")
                            }}
                            onUploadError={(error: Error) => {
                              // Do something with the error.
                              toast.error(`ERROR! ${error.message}`);
                            }}
                      />
                      
                      {form.imageUrl && (
                       
                          <Image src={form.imageUrl} alt={form.title} width={300} height={250} />
                         
                      )}
                    </div>
                  </div>
                </div>
              </section>

              {/* Content Blocks */}
              <section className="pt-8 border-t border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Contenu de l&apos;article</h2>
                <div className="space-y-6">
                  {form.content.map((block, index) => (
                    <div
                      key={index}
                      className="relative bg-gray-50 border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow"
                    >
                      {form.content.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeContentBlock(index)}
                          className="absolute top-4 right-4 p-2 text-red-500 hover:bg-red-50 rounded-lg transition"
                        >
                          <Trash2 size={18} />
                        </button>
                      )}

                      <div className="space-y-5">
                        <div>
                          <label className="block text-sm font-medium text-gray-600 mb-2">
                            Sous-titre {index + 1}
                          </label>
                          <input
                            type="text"
                            name="subTitle"
                            value={block.subTitle}
                            onChange={(e) => handleContentChange(index, e)}
                            placeholder="Optionnel – un sous-titre clair et structuré"
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-600 mb-2">
                            Contenu
                          </label>
                          <textarea
                            name="text"
                            rows={6}
                            value={block.text}
                            onChange={(e) => handleContentChange(index, e)}
                            placeholder="Écrivez votre paragraphe ici... Markdown supporté si besoin."
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none font-medium"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={addContentBlock}
                  className="mt-6 flex items-center gap-2 px-5 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition shadow-sm"
                >
                  <PlusCircle size={20} />
                  Ajouter une section
                </button>
              </section>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}