"use client";

import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import BinAndImageUploader from "@/components/dashboard/animation/createAnimation";
import { DataList } from "@/components/ui/dataList";

type AnimationBin = {
  name: string;
  url: string;
  size: number;
};

export default function CreateAnimationPage() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
    const [binData, setBinData] = useState<AnimationBin | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [number,setNumber] = useState(0)

  const handleBinUpload = (bin: AnimationBin) => {
    setBinData(bin);
  };



  const handleSubmit = async () => {
    // Validation
    if (!name.trim()) {
      toast.error("Animation name is required");
      return;
    }
   
    if (!binData) {
      toast.error("Please upload the .bin animation file");
      return;
    }
    if (!number) {
      toast.error("Please upload a preview image");
      return;
    }

    setIsSubmitting(true);

    const link = binData.url;

    const payload = {
      name: name.trim(),
      link,
      number,
      description,
    };

    try {
      const response = await fetch("/api/v1/version/new", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message || "Failed to add version");
      }

      toast.success("Animation created successfully! 🎉");

      // Reset form
      setName("");
      setDescription("");
      setBinData(null);
      setNumber(0);
    } catch (error: any) {
      toast.error(error.message || "Failed to add version");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-10 px-6">
      <h1 className="text-3xl font-bold mb-10">Add new version</h1>

      <div className="space-y-8">
        {/* Animation Name */}
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            placeholder="e.g. capooRolling"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={isSubmitting}
          />
        </div>

         {/* Animation Description */}
        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Input
            id="description"
            placeholder="e.g. New Feature..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={isSubmitting}
          />
        </div>

         {/* Animation Number */}
        <div className="space-y-2">
          <Label htmlFor="number">Version Number</Label>
          <Input
            id="number"
            placeholder="e.g. 1.2 "
            value={number}
            onChange={(e) => setNumber(e.target.value ? parseFloat(e.target.value) : 0)}
            type="number"
            disabled={isSubmitting}
          />
        </div>

        {/* Uploaders */}
        <BinAndImageUploader
          onBinUpload={handleBinUpload}
        />

        {/* Submit */}
        <div className="flex justify-end pt-6">
          <Button
            onClick={handleSubmit}
            disabled={
              isSubmitting ||
              !name.trim() ||
              !binData ||
              !number
            }
            size="lg"
            className="min-w-48"
          >
            {isSubmitting ? "Adding..." : "Add Version"}
          </Button>
        </div>
      </div>
    </div>
  );
}