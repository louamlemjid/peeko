"use client";

import { useState, useEffect } from "react";
import AnimationCard from "@/components/dashboard/animation/updateAnimation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "react-toastify";
import { DataList } from "@/components/ui/dataList";

type Animation = {
  _id: string;
  name: string;
  category: string;
  imageUrl: string;
  link: string;
};

const categoryOptions = [
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

export default function CreatePictureSetPage() {
  const [name, setName] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const [selectedAnimationIds, setSelectedAnimationIds] = useState<string[]>([]);
  const [paid, setPaid] = useState<boolean>(false);
  const [price, setPrice] = useState<string>("0");
  const [animations, setAnimations] = useState<Animation[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const fetchAnimations = async (filter: string = "") => {
    setLoading(true);
    try {
      let url = "/api/v1/animation/";
      if (filter) {
        url = `/api/v1/animation/category/${encodeURIComponent(filter.toLowerCase())}`;
      }
      const res = await fetch(url);
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || "Failed to fetch animations");
      }
      const data = await res.json();
      const animationsList = data.animations || data;
      setAnimations(animationsList || []);
    } catch (err: any) {
      toast.error(err.message || "Failed to load animations");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnimations();
  }, []);

  // Toggle animation in/out of selection
  const toggleAnimation = (animationId: string) => {
    setSelectedAnimationIds((prev) =>
      prev.includes(animationId)
        ? prev.filter((id) => id !== animationId) // Remove if already selected
        : [...prev, animationId] // Add if not selected
    );
  };

  const handleSubmit = async () => {
    if (!name.trim()) return toast.error("Set name is required");
    if (!category) return toast.error("Category is required");
    if (selectedAnimationIds.length === 0) return toast.error("Please select at least one animation");
    if (paid && (!price || parseFloat(price) <= 0)) return toast.error("Enter a valid price");

    setSubmitting(true);

    const payload = {
      name: name.trim(),
      category,
      animations: selectedAnimationIds,
      paid,
      price: paid ? parseFloat(price) : 0,
    };

    try {
      const res = await fetch("/api/v1/pictureSet/new", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || "Failed to create animation set");
      }

      toast.success("Animation Set created successfully! 🎉");
      // Reset form
      setName("");
      setCategory("");
      setSelectedAnimationIds([]);
      setPaid(false);
      setPrice("0");
    } catch (err: any) {
      toast.error(err.message || "Failed to create set");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-10 px-6">
      <h1 className="text-3xl font-bold mb-8">Create New Animation Set</h1>

      <div className="grid lg:grid-cols-2 gap-10">
        {/* Left: Form */}
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="set-name">Set Name</Label>
            <Input
              id="set-name"
              placeholder="e.g. Capoo Premium Pack"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={submitting}
            />
          </div>

          <div className="space-y-2">
            <Label>Category</Label>
            <DataList
              options={categoryOptions}
              value={category}
              onValueChange={setCategory}
              placeholder="Select or type a category..."
              disabled={submitting}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label>Paid Set</Label>
              <p className="text-sm text-muted-foreground">
                Charge users to unlock this set
              </p>
            </div>
            <button
              onClick={() => setPaid(!paid)}
              className={cn(
                "px-6 py-2 rounded-lg font-medium transition",
                paid
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-accent"
              )}
            >
              {paid ? "Make Free" : "Make Paid $$"}
            </button>
          </div>

          {paid && (
            <div className="space-y-2">
              <Label htmlFor="price">Price (USD)</Label>
              <Input
                id="price"
                type="number"
                min="0"
                step="0.01"
                placeholder="9.99"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                disabled={submitting}
              />
            </div>
          )}

          <Button
            onClick={handleSubmit}
            disabled={
              submitting ||
              !name.trim() ||
              !category ||
              selectedAnimationIds.length === 0
            }
            size="lg"
            className="w-full"
          >
            {submitting ? "Creating..." : "Create Animation Set"}
          </Button>
        </div>

        {/* Right: Multi-Select with Checkboxes */}
        <div>
          <h2 className="text-xl font-semibold mb-4">
            Select Animations ({selectedAnimationIds.length} selected)
          </h2>

          {loading ? (
            <p className="text-muted-foreground">Loading animations...</p>
          ) : animations.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              No animations found. Create some first!
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {animations.map((animation) => {
                const isSelected = selectedAnimationIds.includes(animation._id);

                return (
                  <label
                    key={animation._id}
                    className={cn(
                      "relative block rounded-lg overflow-hidden border-2 transition-all cursor-pointer",
                      isSelected
                        ? "border-primary ring-2 ring-primary ring-offset-2"
                        : "border-transparent hover:border-muted-foreground/50"
                    )}
                    onClick={() => toggleAnimation(animation._id)}
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleAnimation(animation._id)}
                      className="sr-only"
                    />

                    <AnimationCard
                      categories={[]}
                      animation={animation}
                      onUpdate={() => {}}
                      onDelete={() => {}}
                    />

                    {/* Selected overlay & checkmark */}
                    {isSelected && (
                      <>
                        <div className="absolute inset-0 bg-primary/20 pointer-events-none" />
                        <div className="absolute top-3 right-3 bg-primary text-primary-foreground rounded-full p-2 shadow-lg">
                          <Check className="h-6 w-6" />
                        </div>
                      </>
                    )}
                  </label>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}