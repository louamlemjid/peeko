"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Pencil, Trash2, X, Check } from "lucide-react";
import { toast } from "react-toastify";
import BinAndImageUploader from "../animation/createAnimation";

type Version = {
  _id: string;
  name: string;
  description: string;
  number: number;
  link: string;
};

type VersionCardProps = {
  version: Version;
  onUpdate?: () => void;
  onDelete?: () => void;
};

export default function VersionCard({
  version,
  onUpdate,
  onDelete,
}: VersionCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Edit form states
  const [editName, setEditName] = useState(version.name);
  const [editDescription, setEditDescription] = useState(version.description);
  const [editNumber, setEditNumber] = useState(version.number.toString());
  const [editLink, setEditLink] = useState(version.link);

  const startEditing = () => {
    setIsEditing(true);
    // Reset to original values
    setEditName(version.name);
    setEditDescription(version.description);
    setEditNumber(version.number.toString());
    setEditLink(version.link);
  };

  const cancelEditing = () => {
    setIsEditing(false);
  };

  const saveChanges = async () => {
    // Basic validation
    if (!editName.trim()) {
      toast.error("Version name is required");
      return;
    }

    const num = parseInt(editNumber);
    if (isNaN(num) || num < 1) {
      toast.error("Version number must be a positive integer");
      return;
    }

    setIsSaving(true);

    const payload = {
      name: editName.trim(),
      description: editDescription.trim(),
      number: num,
      link: editLink.trim(),
    };

    try {
      const res = await fetch(`/api/v1/animation/version/${version._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || "Failed to update version");
      }

      toast.success("Version updated successfully!");
      setIsEditing(false);
      onUpdate?.();
    } catch (err: any) {
      toast.error(err.message || "Failed to save changes");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm(`Delete version ${version.number} (${version.name}) permanently?`)) {
      return;
    }

    setIsDeleting(true);

    try {
      const res = await fetch(`/api/v1/animation/version/${version._id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || "Failed to delete version");
      }

      toast.success("Version deleted");
      onDelete?.();
    } catch (err: any) {
      toast.error(err.message || "Failed to delete");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="rounded-xl border bg-card text-card-foreground shadow-sm overflow-hidden flex flex-col h-full">
      {/* Header / Version Badge */}
      <div className="bg-muted/60 px-4 py-3 border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 text-primary font-bold px-3 py-1 rounded-md text-sm">
              v{version.number}
            </div>
            <h3 className="font-semibold text-lg">{version.name}</h3>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex-1 space-y-4">
        

{isEditing ? (
  <div className="border-t bg-muted/30 px-4 pt-6 pb-8 space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-2">
        <Label htmlFor={`v-name-${version._id}`}>Version Name</Label>
        <Input
          id={`v-name-${version._id}`}
          value={editName}
          onChange={(e) => setEditName(e.target.value)}
          disabled={isSaving}
          placeholder="e.g. Enhanced Movement Pack"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor={`v-number-${version._id}`}>Version Number</Label>
        <Input
          id={`v-number-${version._id}`}
          type="number"
          min="1"
          value={editNumber}
          onChange={(e) => setEditNumber(e.target.value)}
          disabled={isSaving}
        />
      </div>
    </div>

    <div className="space-y-2">
      <Label htmlFor={`v-link-${version._id}`}>Direct Download Link (optional)</Label>
      <Input
        id={`v-link-${version._id}`}
        value={editLink}
        onChange={(e) => setEditLink(e.target.value)}
        disabled={isSaving}
        placeholder="https://cdn.example.com/animation-v1.2.bin"
      />
      <p className="text-xs text-muted-foreground mt-1">
        You can either provide a direct link or upload a new .bin file below
      </p>
    </div>

    <div className="space-y-3 pt-4">
      <Label>Upload new .bin file (will replace current version file)</Label>
      
      <BinAndImageUploader
        initialBinUrl={editLink}           // show current link as "already uploaded"
        initialImageUrl=""                 // no image for versions
        onBinUpload={(bin) => {
          setEditLink(bin.url);           // update link when new bin is uploaded
        }}
        onImageUpload={() => {}}           // empty - we don't use image
        className="max-w-none"             // remove max-width constraint
      />
    </div>

    <div className="space-y-2 pt-4">
      <Label htmlFor={`v-desc-${version._id}`}>What's new in this version?</Label>
      <textarea
        id={`v-desc-${version._id}`}
        value={editDescription}
        onChange={(e) => setEditDescription(e.target.value)}
        disabled={isSaving}
        className="w-full min-h-[100px] rounded-md border border-input bg-background px-3 py-2 text-sm ..."
        placeholder="• Improved performance\n• Fixed animation glitches\n• Added new expressions..."
      />
    </div>
  </div>
) : (
          <div className="space-y-3">
            {version.description ? (
              <p className="text-sm text-muted-foreground leading-relaxed">
                {version.description}
              </p>
            ) : (
              <p className="text-sm text-muted-foreground italic">
                No description provided
              </p>
            )}

            <div className="pt-2">
              <a
                href={version.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-primary hover:underline inline-flex items-center gap-1"
              >
                Download Version {version.number}
              </a>
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="px-4 pb-4 pt-2 border-t bg-muted/30 flex justify-end gap-2">
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
              disabled={isDeleting}
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
              <Trash2 className="h-4 w-4 mr-1" />
              Delete
            </Button>
          </>
        )}
      </div>
    </div>
  );
}