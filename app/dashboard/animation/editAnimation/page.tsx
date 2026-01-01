"use client";

import { useEffect, useState, useCallback } from "react";
import { debounce } from "lodash"; 
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";
import AnimationCard from "@/components/dashboard/animation/updateAnimation";

type Animation = {
  _id: string;
  name: string;
  category: string;
  imageUrl: string;
  link: string;
};

export default function EditAnimationsPage() {
  const [animations, setAnimations] = useState<Animation[]>([]);
  const [categoryFilter, setCategoryFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Debounced fetch to avoid hammering the API while typing
  const debouncedFetch = useCallback(
    debounce((filter: string) => {
      fetchAnimations(filter.trim());
    }, 500),
    []
  );

  const fetchAnimations = async (filter: string = "") => {
    setLoading(true);
    setError(null);

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
      setError(err.message || "Something went wrong");
      toast.error(err.message || "Failed to load animations");
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchAnimations();
  }, []);

  // Trigger search on input change (debounced)
  useEffect(() => {
    debouncedFetch(categoryFilter);
  }, [categoryFilter, debouncedFetch]);

  // Clear filter
  const clearFilter = () => {
    setCategoryFilter("");
  };

  return (
    <div className="max-w-7xl mx-auto py-10 px-6">
      {/* Header + Filter */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-10">
        <div>
          <h1 className="text-3xl font-bold">Edit Animations</h1>
          <p className="text-muted-foreground mt-2">
            Manage your animations — edit or delete them.
          </p>
        </div>

        <div className="w-full sm:w-80">
          <Label htmlFor="category-filter">Filter by Category</Label>
          <div className="relative">
            <Input
              id="category-filter"
              placeholder="e.g. idle, dance, happy..."
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="pr-10"
            />
            {categoryFilter && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8"
                onClick={clearFilter}
              >
                ×
              </Button>
            )}
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            Type to filter by category (partial match)
          </p>
        </div>
      </div>

      {/* Loading Skeleton */}
      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="rounded-xl border bg-card animate-pulse h-80"
            >
              <div className="aspect-video bg-muted" />
              <div className="p-4 space-y-3">
                <div className="h-6 bg-muted rounded w-3/4" />
                <div className="h-4 bg-muted rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="text-center py-12">
          <p className="text-destructive text-lg">{error}</p>
          <Button variant="outline" onClick={() => fetchAnimations(categoryFilter)} className="mt-4">
            Try Again
          </Button>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && animations.length === 0 && (
        <div className="text-center py-12 border rounded-lg bg-muted/30">
          <p className="text-muted-foreground text-lg">
            {categoryFilter
              ? `No animations found for category "${categoryFilter}"`
              : "No animations yet"}
          </p>
          {!categoryFilter && <p className="mt-2">Create some animations first!</p>}
        </div>
      )}

      {/* Grid */}
      {!loading && !error && animations.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {animations.map((animation,index) => (
            <AnimationCard
              key={index}
              animation={animation}
              onUpdate={() => fetchAnimations(categoryFilter)}
              onDelete={() => fetchAnimations(categoryFilter)}
            />
          ))}
        </div>
      )}
    </div>
  );
}