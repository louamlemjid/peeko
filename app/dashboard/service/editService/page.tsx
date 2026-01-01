'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import { toast } from 'react-toastify';
import { ServicePageData } from '@/model/serviceData';
import {
  Edit, Trash2, ChevronDown, ChevronUp,
  Loader2, Plus, X
} from 'lucide-react';
import { UploadButton } from '@/utils/uploadthing';
import Image from 'next/image';

/* --------------------------------------------------------------- */
/* Generic deep-update (type-safe)                                 */
/* --------------------------------------------------------------- */
type Path = (string | number)[];

function setDeep<T>(obj: T, path: Path, value: any): T {
  if (path.length === 0) return value as T;

  const key = path[0];
  if (typeof key === 'number') {
    const arr = [...(obj as unknown as any[])];
    arr[key] = setDeep(arr[key] ?? {}, path.slice(1), value);
    return arr as unknown as T;
  }

  return {
    ...(obj as unknown as Record<string, unknown>),
    [key]: setDeep(
      (obj as unknown as Record<string, unknown>)[key] ?? {},
      path.slice(1),
      value
    ),
  } as unknown as T;
}

function getDeep(obj: any, path: Path): any {
  return path.reduce((o, k) => o?.[k], obj);
}

/* --------------------------------------------------------------- */
const EditServicePage = () => {
  const [services, setServices] = useState<ServicePageData[]>([]);
  const [selectedService, setSelectedService] = useState<ServicePageData | null>(null);
  const [expandedService, setExpandedService] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showModal, setShowModal] = useState(false);

  // Use ref to store the working copy of the service being edited
  const selectedServiceRef = useRef<ServicePageData | null>(null);

  // Sync ref when selectedService changes (only on modal open)
  useEffect(() => {
    selectedServiceRef.current = selectedService;
  }, [selectedService]);

  /* --------------------- FETCH --------------------- */
  const loadServices = async () => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/v1/service', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      if (!res.ok) throw new Error('Failed to fetch services');
      const { data } = (await res.json()) as { data?: ServicePageData[] };
      setServices(data ?? []);
    } catch (e) {
      console.error(e);
      toast.error('Failed to load services');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { loadServices(); }, []);

  /* --------------------- UPDATE --------------------- */
  const handleNestedChange = useCallback((path: Path, value: any) => {
    if (!selectedServiceRef.current) return;
    selectedServiceRef.current = setDeep(selectedServiceRef.current, path, value);
  }, []);

  const handleUpdate = async () => {
    if (!selectedServiceRef.current?.slug) return;
    try {
      setIsUpdating(true);
      const res = await fetch(`/api/v1/service/update/${selectedServiceRef.current.slug}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(selectedServiceRef.current),
      });
      if (!res.ok) {
        const { message } = (await res.json()) as { message?: string };
        throw new Error(message ?? 'Update failed');
      }
      toast.success('Service updated');
      setShowModal(false);
      loadServices();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Update failed');
    } finally {
      setIsUpdating(false);
    }
  };

  /* --------------------- DELETE --------------------- */
  const handleDelete = async (slug: string) => {
    if (!confirm('Delete this service?')) return;
    try {
      setIsDeleting(true);
      const res = await fetch(`/api/v1/service/delete/${slug}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Delete failed');
      toast.success('Service deleted');
      loadServices();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Delete failed');
    } finally {
      setIsDeleting(false);
    }
  };

  /* --------------------- UI --------------------- */
  if (isLoading) {
    return (
      <div className="p-6 flex items-center justify-center gap-2 text-gray-600">
        <Loader2 className="animate-spin" /> Loading services...
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Edit Service</h1>

      {/* ---------- LIST ---------- */}
      <div className="space-y-4">
        {services.length === 0 ? (
          <p className="text-gray-500">No services found.</p>
        ) : (
          services.map(s => (
            <div
              key={s.slug}
              className="border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition bg-white"
            >
              <div
                className="flex justify-between items-center p-4 cursor-pointer"
                onClick={() =>
                  setExpandedService(p => (p === s.slug ? null : s.slug))
                }
              >
                <div>
                  <h3 className="font-semibold text-lg text-gray-800">
                    {s.metadata.title}
                  </h3>
                  <p className="text-sm text-gray-600">Slug: {s.slug}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={e => {
                      e.stopPropagation();
                      setSelectedService(s);
                      setShowModal(true);
                    }}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                  >
                    <Edit size={18} />
                  </button>
                  <button
                    onClick={e => {
                      e.stopPropagation();
                      handleDelete(s.slug);
                    }}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                    disabled={isDeleting}
                  >
                    {isDeleting ? (
                      <Loader2 size={18} className="animate-spin" />
                    ) : (
                      <Trash2 size={18} />
                    )}
                  </button>
                  {expandedService === s.slug ? (
                    <ChevronUp className="text-gray-500" />
                  ) : (
                    <ChevronDown className="text-gray-500" />
                  )}
                </div>
              </div>

              {expandedService === s.slug && (
                <div className="border-t p-4 bg-gray-50 text-sm text-gray-700 space-y-1">
                  <p>
                    <span className="font-semibold">Description:</span>{' '}
                    {s.metadata.description}
                  </p>
                  <p>
                    <span className="font-semibold">Created:</span>{' '}
                    {new Date(s.createdAt).toLocaleString()}
                  </p>
                  <p>
                    <span className="font-semibold">Updated:</span>{' '}
                    {new Date(s.updatedAt).toLocaleString()}
                  </p>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* ---------- MODAL ---------- */}
      {showModal && selectedService && (
        <ModalEditor
          service={selectedService}
          serviceRef={selectedServiceRef}
          onClose={() => setShowModal(false)}
          onUpdate={handleUpdate}
          onNestedChange={handleNestedChange}
          isUpdating={isUpdating}
        />
      )}
    </div>
  );
};

/* --------------------- MODAL EDITOR COMPONENT --------------------- */
function ModalEditor({
  service,
  serviceRef,
  onClose,
  onUpdate,
  onNestedChange,
  isUpdating,
}: {
  service: ServicePageData;
  serviceRef: React.MutableRefObject<ServicePageData | null>;
  onClose: () => void;
  onUpdate: () => void;
  onNestedChange: (path: Path, value: any) => void;
  isUpdating: boolean;
}) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="p-6 border-b flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-800">
            Edit {service.metadata.title}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          {/* Metadata */}
          <Section title="Metadata">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input label="Title" path={['metadata', 'title']} serviceRef={serviceRef} onChange={onNestedChange} />
              <Textarea label="Description" path={['metadata', 'description']} serviceRef={serviceRef} onChange={onNestedChange} />
            </div>
          </Section>

          {/* Hero */}
          <Section title="Hero Section">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {(['heading', 'subheading'] as const).map(f => (
                <Input
                  key={f}
                  label={f.replace(/([A-Z])/g, ' $1').trim()}
                  path={['hero', f]}
                  serviceRef={serviceRef}
                  onChange={onNestedChange}
                />
              ))}
              <div className='flex flex-col'>
                <p className='text-gray-700'>Image Hero</p>
                <UploadButton
                  endpoint="imageUploader"
                  onClientUploadComplete={(res) => {
                    const url = res[0]?.url;
                    if (!url) return;
                    onNestedChange(['hero', 'imageSrc'], url);
                    toast.success('Image téléchargée avec succès !');
                  }}
                  onUploadError={(err) => {
                    toast.error(`Erreur : ${err.message}`);
                  }}
                />
                <Image src={service.hero.imageSrc} alt={service.metadata.title} width={300} height={250}/>
              </div>
            </div>
          </Section>

          {/* Discover section */}
          <Section title="Discover Section">
            <Input
              label="Heading"
              path={['descoverSection','heading']}
              serviceRef={serviceRef}
              onChange={onNestedChange}
            />
            <Textarea
              label="Content"
              path={['descoverSection', 'content']}
              serviceRef={serviceRef}
              onChange={onNestedChange}
            />
          </Section>

          {/* Vehicle Types */}
          <ArraySection
            title="Vehicle Types"
            items={service.vehicleTypes ?? []}
            onChange={v => onNestedChange(['vehicleTypes'], v)}
            renderItem={(_, i) => (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Input label="Name" path={['vehicleTypes', i, 'name']} serviceRef={serviceRef} onChange={onNestedChange} />
                <div className='flex flex-col'>
                  <p className='text-gray-700'>Vehicule Type Image</p>
                  <UploadButton
                    endpoint="imageUploader"
                    onClientUploadComplete={(res) => {
                      const url = res[0]?.url;
                      if (!url) return;
                      onNestedChange(['vehicleTypes', i, 'image'], url);
                      toast.success('Image téléchargée avec succès !');
                    }}
                    onUploadError={(err) => {
                      toast.error(`Erreur : ${err.message}`);
                    }}
                  />
                  {service?.vehicleTypes?.[i]?.image && (
                    <Image src={service.vehicleTypes[i].image} alt={service.vehicleTypes[i].name || "type vehicule securicar"} width={300} height={250}/>
                  )}
                </div>
              </div>
            )}
            newItem={() => ({ name: '', image: '' })}
          />

          {/* Sections */}
          <ArraySection
            title="Content Sections"
            items={service.sections ?? []}
            onChange={v => onNestedChange(['sections'], v)}
            renderItem={(_, i) => (
              <div className="space-y-3 p-4 border rounded-lg bg-gray-50">
                <Input label="Heading" path={['sections', i, 'heading']} serviceRef={serviceRef} onChange={onNestedChange} />
                <Textarea label="Content (Markdown)" path={['sections', i, 'content']} serviceRef={serviceRef} onChange={onNestedChange} />
                <div className='flex flex-col'>
                  <p className='text-gray-700'>Image Section</p>
                  <UploadButton
                    endpoint="imageUploader"
                    onClientUploadComplete={(res) => {
                      const url = res[0]?.url;
                      if (!url) return;
                      onNestedChange(['sections', i, 'image'], url);
                      toast.success('Image téléchargée avec succès !');
                    }}
                    onUploadError={(err) => {
                      toast.error(`Erreur : ${err.message}`);
                    }}
                  />
                  {service.sections[i]?.image && (
                    <Image src={service.sections[i].image} alt={service.sections[i].heading || "section securicar"} width={300} height={250}/>
                  )}
                </div>
              </div>
            )}
            newItem={() => ({
              heading: '',
              content: '',
              image: '',
              imageSrcSet: '',
              imageLeft: true,
            })}
          />

          {/* Advantages */}
          <ArraySection
            title="Advantages"
            items={service.advantages ?? []}
            onChange={v => onNestedChange(['advantages'], v)}
            renderItem={(_, i) => (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Input label="Title" path={['advantages', i, 'title']} serviceRef={serviceRef} onChange={onNestedChange} />
                <Textarea label="Description" path={['advantages', i, 'description']} serviceRef={serviceRef} onChange={onNestedChange} />
              </div>
            )}
            newItem={() => ({ title: '', description: '' })}
          />

          {/* Why Choose */}
          {service.whyChoose && (
            <Section title="Why Choose Us">
              <Input label="Heading" path={['whyChoose', 'heading']} serviceRef={serviceRef} onChange={onNestedChange} />
              <ArraySection
                title="Items"
                items={service.whyChoose.items}
                onChange={v => onNestedChange(['whyChoose', 'items'], v)}
                renderItem={(_, i) => (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <Input label="Title" path={['whyChoose', 'items', i, 'title']} serviceRef={serviceRef} onChange={onNestedChange} />
                    <Input label="Icon (Lucide name)" path={['whyChoose', 'items', i, 'icon']} serviceRef={serviceRef} onChange={onNestedChange} />
                  </div>
                )}
                newItem={() => ({ title: '', icon: '' })}
              />
            </Section>
          )}

          {/* Centers */}
          <ArraySection
            title="Service Centers"
            items={service.centers ?? []}
            onChange={v => onNestedChange(['centers'], v)}
            renderItem={(_, i) => (
              <div className="p-4 border rounded-lg bg-gray-50 space-y-3">
                <Input label="Name" path={['centers', i, 'name']} serviceRef={serviceRef} onChange={onNestedChange} />
                <Input label="Contact" path={['centers', i, 'contact']} serviceRef={serviceRef} onChange={onNestedChange} />
                <Textarea label="Address" path={['centers', i, 'address']} serviceRef={serviceRef} onChange={onNestedChange} />
                <Input label="Image" path={['centers', i, 'image']} serviceRef={serviceRef} onChange={onNestedChange} />
              </div>
            )}
            newItem={() => ({
              name: '',
              contact: '',
              address: '',
              image: '',
              imageSrcSet: '',
              mapImage: '',
              mapLink: '',
              bookingLink: '',
            })}
          />

          {/* Pricing */}
          {service.pricing && (
            <Section title="Pricing">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input label="Text" path={['pricing', 'text']} serviceRef={serviceRef} onChange={onNestedChange} />
                <Input label="Price" path={['pricing', 'price']} serviceRef={serviceRef} onChange={onNestedChange} />
              </div>
            </Section>
          )}
        </div>

        {/* ---------- FOOTER ---------- */}
        <div className="p-6 border-t flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-5 py-2 border rounded-md text-gray-600 hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={onUpdate}
            disabled={isUpdating}
            className="px-5 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
          >
            {isUpdating && <Loader2 size={16} className="animate-spin" />}
            {isUpdating ? 'Updating...' : 'Update Service'}
          </button>
        </div>
      </div>
    </div>
  );
}

/* --------------------- REUSABLE UI --------------------- */
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="border p-5 rounded-lg bg-gray-50">
      <h3 className="font-semibold text-lg mb-4 text-gray-800">{title}</h3>
      {children}
    </div>
  );
}

/*** INPUT ***/
function Input({ 
  label, 
  path,
  serviceRef,
  onChange
}: { 
  label: string; 
  path: Path;
  serviceRef: React.MutableRefObject<ServicePageData | null>;
  onChange: (path: Path, value: any) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Get initial value from ref
  const initialValue = getDeep(serviceRef.current, path);
  
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <input
        ref={inputRef}
        type="text"
        className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        defaultValue={initialValue ?? ''}
        onChange={e => onChange(path, e.target.value)}
      />
    </div>
  );
}

/*** TEXTAREA ***/
function Textarea({ 
  label, 
  path,
  serviceRef,
  onChange
}: { 
  label: string; 
  path: Path;
  serviceRef: React.MutableRefObject<ServicePageData | null>;
  onChange: (path: Path, value: any) => void;
}) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  const initialValue = getDeep(serviceRef.current, path);

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <textarea
        ref={textareaRef}
        className="w-full p-2 border rounded-md h-24 resize-vertical focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        defaultValue={initialValue ?? ''}
        onChange={e => onChange(path, e.target.value)}
      />
    </div>
  );
}

/*** ARRAY SECTION ***/
function ArraySection<T extends object>({
  title,
  items,
  onChange,
  renderItem,
  newItem,
}: {
  title: string;
  items: T[];
  onChange: (v: T[]) => void;
  renderItem: (item: T, idx: number) => React.ReactNode;
  newItem: () => T;
}) {
  const add = () => onChange([...items, newItem()]);
  const remove = (i: number) => onChange(items.filter((_, idx) => idx !== i));

  return (
    <Section title={title}>
      <div className="space-y-4">
        {items.map((it, i) => (
          <div key={i} className="relative">
            <button
              type="button"
              onClick={() => remove(i)}
              className="absolute top-2 right-2 text-red-600 hover:bg-red-50 p-1 rounded z-10"
            >
              <X size={16} />
            </button>
            {renderItem(it, i)}
          </div>
        ))}
        <button
          type="button"
          onClick={add}
          className="flex items-center gap-2 px-4 py-2 border border-dashed border-blue-500 text-blue-600 rounded-md hover:bg-blue-50"
        >
          <Plus size={16} /> Add {title.slice(0, -1)}
        </button>
      </div>
    </Section>
  );
}

export default EditServicePage;