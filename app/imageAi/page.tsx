"use client";

import { useState, useCallback, useEffect } from "react";
import { useDropzone } from "@uploadthing/react";
import { UploadButton, useUploadThing } from "@/utils/uploadthing";
import { toast } from "react-toastify";
import Image from "next/image";
import { DataList } from "@/components/ui/dataList";

export default function BinUploadPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [imageUrl, setImageUrl] = useState("");
  const [animationBin, setAnimationBin] = useState<{
    name: string;
    url: string;
    size: number;
  } | null>(null);

  const [category,setCategory] = useState<string>("")
  useEffect(()=>{console.log(category)},[category])
  const { startUpload, isUploading } = useUploadThing("binUploader", {
    onClientUploadComplete: (res) => {
      const file = res?.[0];
      if (!file) return;

      setAnimationBin({
        name: file.name,
        url: file.ufsUrl,
        size: file.size,
      });
      toast.success("Animation uploaded successfully 🎉");
      setFiles([]);
    },
    onUploadError: (err) => {
      toast.error(`Upload failed: ${err.message}`);
    },
  });

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFiles(acceptedFiles);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/octet-stream": [],
      "": [],
    },
  });
    const categoryOptions = [
      { value: "", label: "None" },
  { value: "idle", label: "Idle" },
  { value: "walk", label: "Walk" },
  { value: "run", label: "Run" },
  { value: "jump", label: "Jump" },
  { value: "dance", label: "Dance" },
  { value: "attack", label: "Attack" },
  { value: "happy", label: "Happy" },
  { value: "sad", label: "Sad" },
  { value: "wave", label: "Wave" },
  { value: "other", label: "Other" },
];

  return (
    <div className="pt-16 max-w-3xl mx-auto space-y-10">
    

<DataList
  options={categoryOptions}
  value={category}
  onValueChange={setCategory}
  placeholder="Select category or type a new one..."
/>
      {/* ================= BIN UPLOAD ================= */}
      <div
        {...getRootProps()}
        className={`
          border-2 border-dashed rounded-xl p-10 text-center transition-all
          ${isDragActive ? "border-blue-500 bg-blue-50" : "border-gray-300 bg-gray-50"}
          hover:border-blue-400 hover:bg-blue-50 cursor-pointer
        `}
      >
        <input {...getInputProps()} />

        <div className="space-y-3">
          <h2 className="text-xl font-semibold text-gray-800">
            Upload animation (.bin)
          </h2>

          <p className="text-gray-500">
            Drag & drop your <span className="font-medium">.bin</span> file here
            <br />
            or click to browse
          </p>
        </div>

        {/* Selected files */}
        {files.length > 0 && (
          <div className="mt-6 space-y-2">
            <p className="text-sm text-gray-600 font-medium">Selected file:</p>

            <ul className="bg-white rounded-lg shadow-sm p-3 text-sm text-gray-700">
              {files.map((file) => (
                <li key={file.name} className="flex items-center gap-2">
                  📦 {file.name}
                </li>
              ))}
            </ul>

            
          </div>
        )}
        
      </div>
      {files.length > 0 && (
  <button
    onClick={() => startUpload(files)}
    disabled={isUploading}
    className={`
      w-full py-3 rounded-lg font-semibold transition
      ${isUploading
        ? "bg-gray-400 cursor-not-allowed"
        : "bg-blue-600 hover:bg-blue-700 text-white"}
    `}
  >
    {isUploading ? "Uploading..." : "Upload animation"}
  </button>
)}
{/* UPLOADED BIN DISPLAY */}
      {animationBin && (
        <div className="border rounded-lg p-4 bg-gray-50">
          <p className="font-semibold text-gray-700">Uploaded animation</p>
          <p className="text-sm text-gray-600">{animationBin.name}</p>
          <p className="text-sm text-gray-500">
            {(animationBin.size / 1024).toFixed(2)} KB
          </p>

          <a
            href={animationBin.url}
            target="_blank"
            className="inline-block mt-2 text-blue-600 underline"
          >
            Download file
          </a>
        </div>
      )}


      {/* ================= IMAGE UPLOAD ================= */}
      <div className="bg-blue-500 rounded-xl shadow p-6 space-y-4 cursor-pointer hover:bg-blue-700">
        <label className="block text-sm font-semibold text-gray-700">
          Image à la une
        </label>

        <UploadButton
          endpoint="imageUploader"
          className="ut-button:bg-green-600 ut-button:hover:bg-green-700"
          onClientUploadComplete={(res) => {
            setImageUrl(res[0].ufsUrl);
            toast.success("Image uploaded successfully");
          }}
          onUploadError={(error: Error) => {
            toast.error(`ERROR! ${error.message}`);
          }}
        />

        {imageUrl && (
          <div className="mt-4 flex justify-center">
            <Image
              src={imageUrl}
              alt="Preview"
              width={300}
              height={250}
              className="rounded-lg border shadow"
            />
          </div>
        )}
      </div>
    </div>
  );
}
