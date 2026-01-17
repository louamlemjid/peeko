"use client";

import { useEffect, useState, useCallback } from "react";
import { debounce } from "lodash"; 
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";
import AnimationCard from "@/components/dashboard/animation/updateAnimation";
import VersionCard from "@/components/dashboard/version/versionCard";

type Version = {
  _id: string;
  name: string;
  description: string;
  number: number;
  link: string;
};

export default function EditversionsPage() {
  const [versions, setVersions] = useState<Version[]>([]);
  const [categoryFilter, setCategoryFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [categories,setCategories] = useState<{ value: string, label: string }[]>([{ value: "", label: "None" }])

  // Debounced fetch to avoid hammering the API while typing
  const debouncedFetch = useCallback(
    debounce((filter: string) => {
      fetchversions(filter.trim());
    }, 500),
    []
  );

  const fetchCategories = async () => {
  
      try {
        let url = "/api/v1/animation/categories";
  
       
  
        const res = await fetch(url);
  
        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.error || "Failed to fetch versions");
        }
  
        const data = await res.json();
        const categoriesList = data.versions || data;
        setCategories(categoriesList)
      } catch (err: any) {
        
        toast.error(err.message || "Failed to load versions");
      } 
    };
  
    // Initial load
    useEffect(() => {
      fetchCategories();
    }, []);

  const fetchversions = async (filter: string = "") => {
    setLoading(true);
    setError(null);

    try {
      let url = "/api/v1/version/";

      

      const res = await fetch(url);

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || "Failed to fetch versions");
      }

      const data = await res.json();
      const versionsList = data.versions || data;
      setVersions(versionsList || []);
    } catch (err: any) {
      setError(err.message || "Something went wrong");
      toast.error(err.message || "Failed to load versions");
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchversions();
  }, []);

  // Trigger search on input change (debounced)
  useEffect(() => {
    debouncedFetch(categoryFilter);
  }, [categoryFilter, debouncedFetch]);



  return (
    <div className="max-w-7xl mx-auto py-10 px-6">
      {/* Header + Filter */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-10">
        <div>
          <h1 className="text-3xl font-bold">Edit versions</h1>
          <p className="text-muted-foreground mt-2">
            Manage your versions — edit or delete them.
          </p>
        </div>

        
      </div>

      {/* Loading Skeleton */}
      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {[...Array(5)].map((_, i) => (
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
          <Button variant="outline" onClick={() => fetchversions(categoryFilter)} className="mt-4">
            Try Again
          </Button>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && versions.length === 0 && (
        <div className="text-center py-12 border rounded-lg bg-muted/30">
          <p className="text-muted-foreground text-lg">
            {categoryFilter
              ? `No versions found for category "${categoryFilter}"`
              : "No versions yet"}
          </p>
          {!categoryFilter && <p className="mt-2">Create some versions first!</p>}
        </div>
      )}

      {/* Grid */}
      {!loading && !error && versions.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {versions.map((version,index) => (
            <VersionCard key={index} version={version} />
          ))}
        </div>
      )}
    </div>
  );
}