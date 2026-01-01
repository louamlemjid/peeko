"use client";

import { useState } from "react";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import BinAndImageUploader from "@/components/dashboard/animation/createAnimation";

type AnimationBin = {
  name: string;
  url: string;
  size: number;
};

export default function CreateAnimationPage() {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [binData, setBinData] = useState<AnimationBin | null>(null);
  const [imageUrl, setImageUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleBinUpload = (bin: AnimationBin) => {
    setBinData(bin);
  };

  const handleImageUpload = (url: string) => {
    setImageUrl(url);
  };

  const handleSubmit = async () => {
    // Validation
    if (!name.trim()) {
      toast.error("Animation name is required");
      return;
    }
    if (!category.trim()) {
      toast.error("Category is required");
      return;
    }
    if (!binData) {
      toast.error("Please upload the .bin animation file");
      return;
    }
    if (!imageUrl) {
      toast.error("Please upload a preview image");
      return;
    }

    setIsSubmitting(true);

    const link = new URL(binData.url).pathname;

    const payload = {
      name: name.trim(),
      link,
      category: category.trim().toLowerCase(), // optional: normalize
      imageUrl,
    };

    try {
      const response = await fetch("/api/v1/animation/new", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message || "Failed to create animation");
      }

      toast.success("Animation created successfully! 🎉");

      // Reset form
      setName("");
      setCategory("");
      setBinData(null);
      setImageUrl("");
    } catch (error: any) {
      toast.error(error.message || "Failed to create animation");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-10 px-6">
      <h1 className="text-3xl font-bold mb-10">Create New Animation</h1>

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

        {/* Category - Now a text input */}
        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <Input
            id="category"
            placeholder="e.g. idle, walk, dance, happy"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            disabled={isSubmitting}
          />
          <p className="text-sm text-muted-foreground">
            Enter one category (lowercase recommended)
          </p>
        </div>

        {/* Uploaders */}
        <BinAndImageUploader
          onBinUpload={handleBinUpload}
          onImageUpload={handleImageUpload}
          initialImageUrl={imageUrl}
        />

        {/* Submit */}
        <div className="flex justify-end pt-6">
          <Button
            onClick={handleSubmit}
            disabled={
              isSubmitting ||
              !name.trim() ||
              !category.trim() ||
              !binData ||
              !imageUrl
            }
            size="lg"
            className="min-w-48"
          >
            {isSubmitting ? "Creating..." : "Create Animation"}
          </Button>
        </div>
      </div>
    </div>
  );
}