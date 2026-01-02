"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Pencil, Trash2, Check, X } from "lucide-react";
import { toast } from "react-toastify";
import { DataList } from "@/components/ui/dataList"; // Your TailwindCombobox renamed
import AnimationCard from "@/components/dashboard/animation/updateAnimation";
import { cn } from "@/lib/utils";

type Animation = {
  _id: string;
  name: string;
  category: string;
  link: string;
  imageUrl: string;
};

type AnimationSet = {
  _id: string;
  name: string;
  category: string;
  animations: Animation[];
  paid: boolean;
  price: number;
  createdAt: string;
  updatedAt: string;
};

const categoryOptions = [
  { value: "capoo", label: "Capoo" },
  { value: "idle", label: "Idle" },
  { value: "walk", label: "Walk" },
  { value: "dance", label: "Dance" },
  { value: "happy", label: "Happy" },
  { value: "other", label: "Other" },
];

export default function EditAnimationSetsPage() {
  const [sets, setSets] = useState<AnimationSet[]>([]);
  const [allAnimations, setAllAnimations] = useState<Animation[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<AnimationSet & { selectedAnimationIds: string[] }>>({});

  // Fetch all animation sets
  const fetchSets = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/v1/animationSet/");
      if (!res.ok) throw new Error("Failed to fetch animation sets");
      const data = await res.json();
      setSets(data || []);
    } catch (err: any) {
      toast.error(err.message || "Failed to load sets");
    } finally {
      setLoading(false);
    }
  };

  // Fetch all available animations (for adding to sets)
  const fetchAllAnimations = async () => {
    try {
      const res = await fetch("/api/v1/animation/");
      if (!res.ok) throw new Error("Failed to fetch animations");
      const data = await res.json();
      const list = (data.animations || data) as Animation[];
      setAllAnimations(list);
    } catch (err: any) {
      toast.error("Could not load animations for selection");
    }
  };

  useEffect(() => {
    fetchSets();
    fetchAllAnimations();
  }, []);

  const startEditing = (set: AnimationSet) => {
    setEditingId(set._id);
    setEditForm({
      name: set.name,
      category: set.category,
      paid: set.paid,
      price: set.price,
      animations: set.animations,
      selectedAnimationIds: set.animations.map(a => a._id),
    });
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditForm({});
  };

  const toggleAnimationInSet = (animationId: string) => {
    setEditForm(prev => {
      const current = prev.selectedAnimationIds || [];
      if (current.includes(animationId)) {
        return { ...prev, selectedAnimationIds: current.filter(id => id !== animationId) };
      } else {
        return { ...prev, selectedAnimationIds: [...current, animationId] };
      }
    });
  };

  const saveEdit = async (id: string) => {
    if (!editForm.name?.trim()) return toast.error("Name is required");
    if (!editForm.category) return toast.error("Category is required");
    if (!editForm.selectedAnimationIds || editForm.selectedAnimationIds.length === 0)
      return toast.error("Select at least one animation");

    const payload = {
      name: editForm.name.trim(),
      category: editForm.category,
      animations: editForm.selectedAnimationIds,
      paid: editForm.paid || false,
      price: editForm.paid ? editForm.price || 0 : 0,
    };

    try {
      const res = await fetch(`/api/v1/animationSet/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || "Failed to update");
      }

      toast.success("Set updated successfully!");
      fetchSets();
      cancelEditing();
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const deleteSet = async (id: string) => {
    if (!confirm("Delete this animation set permanently?")) return;

    try {
      const res = await fetch(`/api/v1/animationSet/delete/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || "Failed to delete");
      }

      toast.success("Set deleted");
      fetchSets();
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-10 px-6">
      <h1 className="text-3xl font-bold mb-8">Edit Animation Sets</h1>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="rounded-xl border bg-card p-6 animate-pulse">
              <div className="h-8 bg-muted rounded w-3/4 mb-4" />
              <div className="h-32 bg-muted rounded mb-4" />
              <div className="h-4 bg-muted rounded w-1/2" />
            </div>
          ))}
        </div>
      ) : sets.length === 0 ? (
        <div className="text-center py-16 border rounded-xl bg-muted/30">
          <p className="text-xl text-muted-foreground">No animation sets yet</p>
          <p className="mt-2">Create your first set!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {sets.map((set) => (
            <div key={set._id} className="rounded-xl border bg-card shadow-sm overflow-hidden">
              {/* Header */}
              <div className="p-6 border-b">
                {editingId === set._id ? (
                  <div className="space-y-4">
                    <Input
                      value={editForm.name || ""}
                      onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                      placeholder="Set name"
                    />
                    <DataList
                      options={categoryOptions}
                      value={editForm.category || ""}
                      onValueChange={(val) => setEditForm({ ...editForm, category: val })}
                      placeholder="Category"
                    />
                  </div>
                ) : (
                  <>
                    <h3 className="text-xl font-bold">{set.name}</h3>
                    <p className="text-sm text-muted-foreground capitalize mt-1">
                      Category: {set.category}
                    </p>
                  </>
                )}
              </div>

              {/* Animations in Set */}
              <div className="p-6 bg-muted/30">
                <p className="text-sm font-medium mb-3">
                  {set.animations.length} Animation{set.animations.length !== 1 ? "s" : ""}
                </p>
                <div className="grid grid-cols-2 gap-3 mb-6">
                  {set.animations.map((anim) => (
                    <div key={anim._id} className="relative aspect-video rounded-lg overflow-hidden bg-background border">
                      <AnimationCard categories={[]} animation={anim} onUpdate={() => {}} onDelete={() => {}} />
                    </div>
                  ))}
                </div>

                {/* Add/Remove Animations when editing */}
                {editingId === set._id && (
                  <>
                    <h4 className="font-medium mb-3">Add or Remove Animations</h4>
                    <div className="grid grid-cols-2 gap-4 max-h-96 overflow-y-auto">
                      {allAnimations.map((anim) => {
                        const isSelected = editForm.selectedAnimationIds?.includes(anim._id);
                        return (
                          <label
                            key={anim._id}
                            className={cn(
                              "relative block rounded-lg overflow-hidden border-2 transition-all cursor-pointer",
                              isSelected
                                ? "border-primary ring-2 ring-primary ring-offset-2"
                                : "border-transparent hover:border-muted-foreground/50"
                            )}
                          >
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => toggleAnimationInSet(anim._id)}
                              className="sr-only"
                            />
                            <AnimationCard categories={[]} animation={anim} onUpdate={() => {}} onDelete={() => {}} />
                            {isSelected && (
                              <div className="absolute top-2 right-2 bg-primary text-primary-foreground rounded-full p-1.5">
                                <Check className="h-5 w-5" />
                              </div>
                            )}
                          </label>
                        );
                      })}
                    </div>
                  </>
                )}
              </div>

              {/* Footer */}
              <div className="p-6 space-y-4">
                {editingId === set._id ? (
                  <>
                    <div className="flex items-center justify-between">
                      <Label>Paid Set</Label>
                      <button
                        onClick={() => setEditForm(prev => ({
                          ...prev,
                          paid: !prev.paid,
                          price: !prev.paid ? prev.price || 0 : 0
                        }))}
                        className={cn(
                          "px-4 py-2 rounded-lg font-medium",
                          editForm.paid ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                        )}
                      >
                        {editForm.paid ? "Make Free" : "Make Paid $$"}
                      </button>
                    </div>
                    {editForm.paid && (
                      <Input
                        type="number"
                        min="0"
                        step="0.01"
                        placeholder="Price"
                        value={editForm.price || ""}
                        onChange={(e) => setEditForm({ ...editForm, price: parseFloat(e.target.value) || 0 })}
                      />
                    )}
                  </>
                ) : (
                  <div className="flex items-center justify-between">
                    <div>
                      {set.paid ? (
                        <p className="font-semibold text-primary">${set.price.toFixed(2)}</p>
                      ) : (
                        <p className="text-muted-foreground">Free</p>
                      )}
                    </div>
                  </div>
                )}

                <div className="flex gap-2">
                  {editingId === set._id ? (
                    <>
                      <Button size="sm" variant="ghost" onClick={cancelEditing}>
                        <X className="h-4 w-4 mr-1" /> Cancel
                      </Button>
                      <Button size="sm" onClick={() => saveEdit(set._id)}>
                        <Check className="h-4 w-4 mr-1" /> Save
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button size="sm" variant="secondary" onClick={() => startEditing(set)}>
                        <Pencil className="h-4 w-4 mr-1" /> Edit
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => deleteSet(set._id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}