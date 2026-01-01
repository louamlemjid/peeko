'use client';
import { useState, useRef } from 'react';
import { toast } from 'react-toastify';
import { ServicePageData } from '@/model/serviceData';
import { UploadButton } from '@/utils/uploadthing';
import Image from 'next/image';

// ------------------------------------------------------------
// Helper: generate stable IDs for array items
// ------------------------------------------------------------
const useIdGenerator = () => {
  const counter = useRef(0);
  return () => `item-${counter.current++}`;
};

// ------------------------------------------------------------
// Main component
// ------------------------------------------------------------
const CreateServicePage = () => {
  const generateId = useIdGenerator();

  const initialData: Partial<ServicePageData> = {
    metadata: { title: '', description: '' },
    hero: {
      heading: '',
      subheading: '',
      buttonText: '',
      buttonLink: '',
      imageSrc: '',
      imageSrcSet: '',
    },
    descoverSection:{
      heading:'',
      content:''
    },
    vehicleTypes: [],
    sections: [],
    advantages: [],
    whyChoose: { heading: '', items: [] },
    centers: [],
    pricing: { text: '', price: '' },
  };

  const [formData, setFormData] = useState<Partial<ServicePageData>>(initialData);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ------------------------------------------------------------
  // Deep update (immutable)
  // ------------------------------------------------------------
const updateField = (path: (string | number)[], value: any) => {
  setFormData(prev => {
    const newData: any = structuredClone(prev); // <-- IMPORTANT
    let current: any = newData;

    for (let i = 0; i < path.length - 1; i++) {
      const key = path[i];

      if (current[key] === undefined) {
        // if next key is a number → create array
        current[key] = typeof path[i + 1] === "number" ? [] : {};
      }

      current = current[key];
    }

    current[path[path.length - 1]] = value;
    return newData;
  });
};



  // ------------------------------------------------------------
  // Array helpers (with stable ID)
  // ------------------------------------------------------------
  const addToArray = (path: string[]) => {
    const newItem = getEmptyItemForPath(path);
    newItem.id = generateId(); // <-- stable key

    setFormData(prev => {
      const arr = getNestedValue(prev, path) || [];
      return setNestedValue(prev, path, [...arr, newItem]);
    });
  };

  const removeFromArray = (path: string[], index: number) => {
    setFormData(prev => {
      const arr = getNestedValue(prev, path) || [];
      return setNestedValue(prev, path, arr.filter((_: any, i: number) => i !== index));
    });
  };

  // ------------------------------------------------------------
  // Utility: get/set nested values
  // ------------------------------------------------------------
  const getNestedValue = (obj: any, path: string[]): any => {
    return path.reduce((acc, key) => (acc && key in acc ? acc[key] : undefined), obj);
  };

  const setNestedValue = (
    obj: Partial<ServicePageData>,
    path: string[],
    value: unknown
  ): Partial<ServicePageData> => {
    if (path.length === 1) return { ...obj, [path[0]]: value };
    const current = (obj as any)[path[0]];
    return {
      ...obj,
      [path[0]]: setNestedValue(current || {}, path.slice(1), value),
    };
  };

  // ------------------------------------------------------------
  // Empty item factory
  // ------------------------------------------------------------
  const getEmptyItemForPath = (path: string[]): any => {
    const last = path[path.length - 1];
    if (last === 'vehicleTypes') return { name: '', image: '' };
    if (last === 'sections')
      return { heading: '', content: '', image: '', imageSrcSet: '', imageLeft: true };
    if (last === 'advantages') return { title: '', description: '' };
    if (last === 'items' && path.includes('whyChoose')) return { title: '', icon: '' };
    if (last === 'centers')
      return {
        name: '',
        contact: '',
        address: '',
        image: '',
        mapImage: '',
        mapLink: '',
        bookingLink: '',
        imageSrcSet: '',
      };
    return {};
  };

  // ------------------------------------------------------------
  // Submit
  // ------------------------------------------------------------
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.metadata?.title) {
      toast.error('Service title is required');
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await fetch('/api/v1/service/new', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || 'Failed to create service');
      }

      toast.success('Service created successfully!');
      setFormData(initialData);
    } catch (error: any) {
      toast.error(error.message || 'Creation failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  // ------------------------------------------------------------
  // Render
  // ------------------------------------------------------------
  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Create New Service</h1>
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Metadata */}
        <Section title="Metadata">
          <Input
            label="Title *"
            value={formData.metadata?.title || ''}
            onChange={v => updateField(['metadata', 'title'], v)}
          />
          <Textarea
            label="Description"
            value={formData.metadata?.description || ''}
            onChange={v => updateField(['metadata', 'description'], v)}
          />
        </Section>

        {/* Hero */}
        <Section title="Hero Section">
          <Input
            label="Heading"
            value={formData.hero?.heading || ''}
            onChange={v => updateField(['hero', 'heading'], v)}
          />
          <Input
            label="Subheading"
            value={formData.hero?.subheading || ''}
            onChange={v => updateField(['hero', 'subheading'], v)}
          />

          <div className="flex flex-col">
            <p className="text-gray-700 mb-2">Hero Image</p>
            <UploadButton
              endpoint="imageUploader"
              onClientUploadComplete={res => {
                
                  updateField(['hero', 'imageSrc'], res[0]?.url);
                  toast.success('Image uploaded!');
                
              }}
               onUploadError={(error: Error) => {
                              // Do something with the error.
                              toast.error(`ERROR! ${error.message}`);
                            }}
            />
            {formData.hero?.imageSrc && (
              <Image
                src={formData.hero.imageSrc}
                alt="Hero preview"
                width={300}
                height={200}
                className="mt-3 rounded border"
              />
            )}
          </div>
        </Section>
        
        {/* Descover section */}
        <Section title="Descover Section">
          <Input
            label="Heading"
            value={formData.descoverSection?.heading || ''}
            onChange={v => updateField(['descoverSection', 'heading'], v)}
          />

          <Textarea
                label="Content"
                value={formData.descoverSection?.content || ''}
                onChange={v => updateField(['descoverSection', 'content'], v)}
              />
              
        </Section>
        {/* Sections */}
        <Section title="Content Sections">
          <button
            type="button"
            className="mb-3 px-3 py-1 bg-blue-600 text-white rounded"
            onClick={() => addToArray(['sections'])}
          >
            + Add Section
          </button>
          {formData.sections?.map((item: any, idx) => (
            <div key={item.id} className="p-4 border rounded mb-3 relative">
              <button
                type="button"
                className="absolute top-2 right-2 text-red-600"
                onClick={() => removeFromArray(['sections'], idx)}
              >
                X
              </button>
              <Input
                label="Heading"
                value={item.heading || ''}
                onChange={v => updateField(['sections', idx, 'heading'], v)}
              />
              <Textarea
                label="Content (Markdown)"
                value={item.content || ''}
                onChange={v => updateField(['sections', idx, 'content'], v)}
              />
              <Input
                label="Image"
                value={item.image || ''}
                onChange={v => updateField(['sections', idx, 'image'], v)}
              />
              <Input
                label="Image SrcSet"
                value={item.imageSrcSet || ''}
                onChange={v => updateField(['sections', idx, 'imageSrcSet'], v)}
              />
              
            </div>
          ))}
        </Section>
        {/* Vehicle Types */}
        <Section title="Vehicle Types">
          <button
            type="button"
            className="mb-3 px-3 py-1 bg-blue-600 text-white rounded"
            onClick={() => addToArray(['vehicleTypes'])}
          >
            + Add Vehicle Type
          </button>
          {formData.vehicleTypes?.map((item: any, idx) => (
            <div key={item.id} className="p-4 border rounded mb-3 relative">
              <button
                type="button"
                className="absolute top-2 right-2 text-red-600"
                onClick={() => removeFromArray(['vehicleTypes'], idx)}
              >
                X
              </button>
              <Input
                label="Name"
                value={item.name || ''}
                onChange={v => updateField(['vehicleTypes', idx, 'name'], v)}
              />
              <div>
                 <UploadButton
              endpoint="imageUploader"
              onClientUploadComplete={res => {
                
                  updateField(['vehicleTypes', idx, 'image'],res[0]?.ufsUrl);
                  toast.success('Image uploaded!');
                
              }}
               onUploadError={(error: Error) => {
                              // Do something with the error.
                              toast.error(`ERROR! ${error.message}`);
                            }}
            />
            {formData?.vehicleTypes && formData?.vehicleTypes[idx]?.image && (
              <Image
                src={formData.vehicleTypes[idx]?.image}
                alt="Hero preview"
                width={300}
                height={200}
                className="mt-3 rounded border"
              />
            )}
              </div>
            </div>
          ))}
        </Section>


        {/* Advantages */}
        <Section title="Advantages">
          <button
            type="button"
            className="mb-3 px-3 py-1 bg-blue-600 text-white rounded"
            onClick={() => addToArray(['advantages'])}
          >
            + Add Advantage
          </button>
          {formData.advantages?.map((item: any, idx) => (
            <div key={item.id} className="p-4 border rounded mb-3 relative">
              <button
                type="button"
                className="absolute top-2 right-2 text-red-600"
                onClick={() => removeFromArray(['advantages'], idx)}
              >
                X
              </button>
              <Input
                label="Title"
                value={item.title || ''}
                onChange={v => updateField(['advantages', idx, 'title'], v)}
              />
              <Textarea
                label="Description"
                value={item.description || ''}
                onChange={v => updateField(['advantages', idx, 'description'], v)}
              />
            </div>
          ))}
        </Section>

        {/* Why Choose Us */}
        <Section title="Why Choose Us">
          <Input
            label="Heading"
            value={formData.whyChoose?.heading || ''}
            onChange={v => updateField(['whyChoose', 'heading'], v)}
          />
          <button
            type="button"
            className="mt-3 px-3 py-1 bg-blue-600 text-white rounded"
            onClick={() => addToArray(['whyChoose', 'items'])}
          >
            + Add Item
          </button>
          {formData.whyChoose?.items?.map((item: any, idx) => (
            <div key={item.id} className="p-4 border rounded mb-3 relative">
              <button
                type="button"
                className="absolute top-2 right-2 text-red-600"
                onClick={() => removeFromArray(['whyChoose', 'items'], idx)}
              >
                X
              </button>
              <Input
                label="Title"
                value={item.title || ''}
                onChange={v => updateField(['whyChoose', 'items', idx, 'title'], v)}
              />
              <Input
                label="Icon"
                value={item.icon || ''}
                onChange={v => updateField(['whyChoose', 'items', idx, 'icon'], v)}
              />
            </div>
          ))}
        </Section>

        {/* Pricing */}
        <Section title="Pricing (Optional)">
          <Input
            label="Text"
            value={formData.pricing?.text || ''}
            onChange={v => updateField(['pricing', 'text'], v)}
          />
          <Input
            label="Price"
            value={formData.pricing?.price || ''}
            onChange={v => updateField(['pricing', 'price'], v)}
          />
        </Section>

        {/* Submit */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-3 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
        >
          {isSubmitting ? 'Creating...' : 'Create Service'}
        </button>
      </form>
    </div>
  );
};

// ------------------------------------------------------------
// Reusable UI
// ------------------------------------------------------------
const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="border-t pt-6">
    <h2 className="text-xl font-semibold mb-4">{title}</h2>
    {children}
  </div>
);

const Input = ({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) => (
  <div className="mb-3">
    <label className="block mb-1 font-medium">{label}</label>
    <input
      type="text"
      className="w-full p-2 border rounded"
      value={value}
      onChange={e => onChange(e.target.value)}
    />
  </div>
);

const Textarea = ({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) => (
  <div className="mb-3">
    <label className="block mb-1 font-medium">{label}</label>
    <textarea
      className="w-full p-2 border rounded"
      rows={3}
      value={value}
      onChange={e => onChange(e.target.value)}
    />
  </div>
);

export default CreateServicePage;