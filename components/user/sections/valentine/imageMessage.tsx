// components/ui/PictureMessage.tsx
"use client";

import { useState, useEffect, useCallback } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import Skeleton from "react-loading-skeleton"
import { toast } from "react-toastify";

// Match your existing Animation type structure
type Animation = {
  _id: string;
  name: string;
  category: string;
  link: string;
  imageUrl: string;
};

// Minimal PictureSet interface for display purposes
interface PictureSet {
  _id: string;
  name: string;
  category: string;
  animations: Animation[];
  paid: boolean;
  price: number;
}

interface PictureMessageProps {
  show: boolean;
  onClose: () => void;
  onSelect: (animation: Animation) => void;
}

export default function PictureMessage({
  show,
  onClose,
  onSelect,
}: PictureMessageProps) {
  const [sets, setSets] = useState<PictureSet[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedAnimId, setSelectedAnimId] = useState<string | null>(null);

  // Fetch picture sets with populated animations
  const fetchPictureSets = useCallback(async () => {
    if (!show) return;
    
    setLoading(true);
    setError(null);
    const controller = new AbortController();
    
    try {
      const res = await fetch("/api/v1/pictureSet/", {
        signal: controller.signal,
      });
      
      if (!res.ok) throw new Error("Failed to load animation sets");
      
      const data = await res.json();
      // Ensure animations are populated objects (not just IDs)
      const populatedSets = data.filter((set: any) => 
        Array.isArray(set.animations) && 
        set.animations.every((anim: any) => anim && anim._id)
      );
      
      setSets(populatedSets);
    } catch (err) {
      if (err instanceof Error && err.name !== "AbortError") {
        setError(err.message || "Could not load animation sets");
        toast.error("Failed to load animations. Please try again.");
      }
    } finally {
      setLoading(false);
    }
    
    return () => controller.abort();
  }, [show]);

  useEffect(() => {
    if (show) {
      fetchPictureSets();
      // Reset selection when modal opens
      setSelectedAnimId(null);
    }
  }, [show, fetchPictureSets]);

  // Handle animation selection with visual feedback
  const handleSelect = (animation: Animation) => {
    setSelectedAnimId(animation._id);
    // Small delay for visual feedback before closing
    setTimeout(() => {
      onSelect(animation);
      // Parent should handle closing via show prop
    }, 200);
  };

  // Close modal on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    
    if (show) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden"; // Prevent background scroll
    }
    
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "auto";
    };
  }, [show, onClose]);

  if (!show) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="picture-message-modal-title"
    >
      <div 
        className="relative bg-card rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 z-10 border-b bg-card px-6 py-4 flex justify-between items-center">
          <h2 
            id="picture-message-modal-title"
            className="text-xl font-bold"
          >
            Select Animation
          </h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            aria-label="Close animation selector"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="space-y-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="space-y-3">
                  <Skeleton className="h-6 w-48" />
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {[...Array(4)].map((_, j) => (
                      <div key={j} className="space-y-2">
                        <Skeleton className="w-full h-24 rounded-lg" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-8 w-full" />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-12 text-destructive">
              <p className="font-medium">{error}</p>
              <Button 
                variant="outline" 
                size="sm" 
                className="mt-4"
                onClick={fetchPictureSets}
              >
                Retry
              </Button>
            </div>
          ) : sets.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <p className="text-lg mb-2">No animation sets available</p>
              <p className="text-sm">Create sets in the Animation Manager to use here</p>
            </div>
          ) : (
            <div className="space-y-8">
              {sets.map((set) => (
                <div key={set._id} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-lg flex items-center">
                      {set.name}
                      {set.paid && (
                        <span className="ml-2 px-2 py-0.5 bg-amber-100 text-amber-800 text-xs rounded-full">
                          ${set.price.toFixed(2)}
                        </span>
                      )}
                    </h3>
                    <span className="text-sm text-muted-foreground">
                      {set.animations.length} animation{set.animations.length !== 1 ? "s" : ""}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {set.animations.map((anim) => {
                      const isSelected = selectedAnimId === anim._id;
                      return (
                        <div
                          key={anim._id}
                          onClick={() => handleSelect(anim)}
                          className={cn(
                            "border rounded-xl overflow-hidden flex flex-col bg-card transition-all",
                            isSelected 
                              ? "border-primary ring-2 ring-primary/20 ring-offset-2" 
                              : "border-transparent hover:border-muted-foreground/30"
                          )}
                        >
                          <div className="p-2 bg-muted/30 flex-1 flex items-center justify-center min-h-[120px]">
                            {/* Simplified preview - avoids edit controls in AnimationCard */}
                            <div 
                              className="w-full h-full bg-background rounded overflow-hidden border flex items-center justify-center"
                              title={anim.name}
                            >
                              {anim.imageUrl ? (
                                <img 
                                  src={anim.imageUrl} 
                                  alt={anim.name} 
                                  className="max-h-full max-w-full object-contain"
                                  loading="lazy"
                                />
                              ) : (
                                <span className="text-muted-foreground text-sm p-2 text-center">
                                  {anim.name}
                                </span>
                              )}
                            </div>
                          </div>
                          
                          <div className="p-3 space-y-2">
                            <div className="font-medium text-sm truncate" title={anim.name}>
                              {anim.name}
                            </div>
                            <div className="text-xs text-muted-foreground capitalize">
                              {anim.category}
                            </div>
                           
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}