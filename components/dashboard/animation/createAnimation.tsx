"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "@uploadthing/react";
import { UploadButton, useUploadThing } from "@/utils/uploadthing";
import { toast } from "react-toastify";
import Image from "next/image";

type AnimationBin = {
  name: string;
  url: string;
  size: number;
};

type BinAndImageUploaderProps = {
  /** Initial image URL (optional, for editing forms) */
  initialImageUrl?: string;
  /** Callback when image is uploaded */
  onImageUpload?: (url: string) => void;
  /** Callback when .bin is uploaded */
  onBinUpload?: (bin: AnimationBin) => void;
  /** Custom className for the container */
  className?: string;
};

export default function BinAndImageUploader({
  initialImageUrl = "",
  onImageUpload,
  onBinUpload,
  className = "",
}: BinAndImageUploaderProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [imageUrl, setImageUrl] = useState<string>(initialImageUrl);
  const [animationBin, setAnimationBin] = useState<AnimationBin | null>(null);

  const { startUpload, isUploading } = useUploadThing("binUploader", {
    onClientUploadComplete: (res) => {
      const file = res?.[0];
      if (!file) return;

      const binData: AnimationBin = {
        name: file.name,
        url: file.ufsUrl,
        size: file.size,
      };

      setAnimationBin(binData);
      onBinUpload?.(binData);
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
      "application/octet-stream": [".bin"],
    },
    multiple: false, // optional: restrict to one file
  });

  const handleImageUpload = (res: any[]) => {
    const url = res[0].ufsUrl;
    setImageUrl(url);
    onImageUpload?.(url);
    toast.success("Image uploaded successfully");
  };

  return (
    
    <div className={`pt-16 max-w-3xl mx-auto space-y-10 ${className}`}>
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

        {/* Selected file preview */}
        {files.length > 0 && (
          <div className="mt-6 space-y-2">
            <p className="text-sm text-gray-600 font-medium">Selected file:</p>
            <ul className="bg-white rounded-lg shadow-sm p-3 text-sm text-gray-700">
              {files.map((file) => (
                <li key={file.name} className="flex items-center gap-2">
                  📦 {file.name} ({(file.size / 1024).toFixed(1)} KB)
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Upload button */}
      {files.length > 0 && (
        <button
          onClick={() => startUpload(files)}
          disabled={isUploading}
          className={`
            w-full py-3 rounded-lg font-semibold transition
            ${isUploading
              ? "bg-gray-400 cursor-not-allowed text-gray-700"
              : "bg-blue-600 hover:bg-blue-700 text-white"}
          `}
        >
          {isUploading ? "Uploading..." : "Upload animation"}
        </button>
      )}

      {/* Uploaded BIN display */}
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
            rel="noopener noreferrer"
            className="inline-block mt-2 text-blue-600 underline"
          >
            Download file
          </a>
        </div>
      )}

      {/* ================= IMAGE UPLOAD ================= */}
      <div className="bg-blue-500 rounded-xl shadow p-6 space-y-4 hover:bg-blue-600 transition cursor-pointer">
        <label className="block text-sm font-semibold text-white">
          Image à la une
        </label>

        <UploadButton
          endpoint="imageUploader"
          className="ut-button:bg-green-600 ut-button:hover:bg-green-700 ut-button:text-white"
          onClientUploadComplete={handleImageUpload}
          onUploadError={(error: Error) => {
            toast.error(`ERROR! ${error.message}`);
          }}
        />

        {imageUrl && (
          <div className="mt-6 flex justify-center">
            <Image
              src={imageUrl}
              alt="Featured preview"
              width={400}
              height={300}
              className="rounded-lg border shadow-lg object-cover"
            />
          </div>
        )}
      </div>
    </div>
  );
}