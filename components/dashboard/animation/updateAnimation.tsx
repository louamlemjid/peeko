"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Pencil, Trash2, X, Check } from "lucide-react";
import { toast } from "react-toastify";
import BinAndImageUploader from "./createAnimation";

type Animation = {
  _id: string;
  name: string;
  category: string;
  imageUrl: string;
  link: string;
};

type AnimationCardProps = {
  animation: Animation;
  onUpdate?: () => void; // refresh list after edit
  onDelete?: () => void;  // refresh list after delete
};

export default function AnimationCard({
  animation,
  onUpdate,
  onDelete,
}: AnimationCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(animation.name);
  const [editCategory, setEditCategory] = useState(animation.category);
  const [editImageUrl, setEditImageUrl] = useState(animation.imageUrl);
  const [newBinData, setNewBinData] = useState<{ url: string } | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleImageUpload = (url: string) => {
    setEditImageUrl(url);
  };

  const handleBinUpload = (bin: { url: string }) => {
    setNewBinData(bin);
  };

  const startEditing = () => {
    setIsEditing(true);
    // Reset to current values in case user cancels
    setEditName(animation.name);
    setEditCategory(animation.category);
    setEditImageUrl(animation.imageUrl);
    setNewBinData(null);
  };

  const cancelEditing = () => {
    setIsEditing(false);
    setNewBinData(null);
  };

  const saveChanges = async () => {
    if (!editName.trim() || !editCategory.trim()) {
      toast.error("Name and category are required");
      return;
    }

    setIsSaving(true);

    const payload: any = {
      name: editName.trim(),
      category: editCategory.trim(),
      imageUrl: editImageUrl,
    };

    if (newBinData) {
      payload.link = new URL(newBinData.url).pathname;
    }

    try {
      const res = await fetch(`/api/v1/animation/${animation._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || "Failed to update");
      }

      toast.success("Animation updated!");
      setIsEditing(false);
      onUpdate?.();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Delete this animation permanently?")) return;

    setIsDeleting(true);
    try {
      const res = await fetch(`/api/v1/animation/delete/${animation._id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || "Failed to delete");
      }

      toast.success("Animation deleted");
      onDelete?.();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="rounded-xl border bg-card text-card-foreground shadow-sm overflow-hidden">
      {/* Image */}
      <div className="aspect-video relative bg-muted">
        <Image
          src={animation.imageUrl}
          alt={animation.name}
          fill
          className="object-cover"
        />
      </div>

      {/* Card Body */}
      <div className="p-4 space-y-3">
        <h3 className="font-semibold text-lg">{animation.name}</h3>
        <p className="text-sm text-muted-foreground capitalize">
          Category: {animation.category}
        </p>
      </div>

      {/* Action Buttons */}
      <div className="px-4 pb-4 flex justify-end gap-2">
        {isEditing ? (
          <>
            <Button
              size="sm"
              variant="ghost"
              onClick={cancelEditing}
              disabled={isSaving}
            >
              <X className="h-4 w-4 mr-1" />
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={saveChanges}
              disabled={isSaving}
            >
              <Check className="h-4 w-4 mr-1" />
              {isSaving ? "Saving..." : "Save"}
            </Button>
          </>
        ) : (
          <>
            <Button
              size="sm"
              variant="secondary"
              onClick={startEditing}
            >
              <Pencil className="h-4 w-4 mr-1" />
              Edit
            </Button>
            <Button
              size="sm"
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </>
        )}
      </div>

      {/* Inline Edit Form */}
      {isEditing && (
        <div className="border-t bg-muted/30 px-4 pt-4 pb-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor={`name-${animation._id}`}>Name</Label>
              <Input
                id={`name-${animation._id}`}
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                disabled={isSaving}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor={`category-${animation._id}`}>Category</Label>
              <Input
                id={`category-${animation._id}`}
                value={editCategory}
                onChange={(e) => setEditCategory(e.target.value)}
                placeholder="e.g. idle"
                disabled={isSaving}
              />
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-sm font-medium">Update Preview Image (optional)</p>
            <BinAndImageUploader
              initialImageUrl={editImageUrl}
              onImageUpload={handleImageUpload}
              onBinUpload={handleBinUpload}
            />
            {editImageUrl && (
              <div className="flex justify-center mt-4">
                <Image
                  src={editImageUrl}
                  alt="Preview"
                  width={300}
                  height={200}
                  className="rounded-lg border shadow-sm"
                />
              </div>
            )}
          </div>

          {newBinData && (
            <p className="text-sm text-green-600">
              New .bin file uploaded and will be saved
            </p>
          )}
        </div>
      )}
    </div>
  );
}