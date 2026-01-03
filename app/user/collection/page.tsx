"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";
import { Check } from "lucide-react";
import { useUserAuth } from "@/hooks/userAuth";

type Animation = {
  _id: string;
  name: string;
  imageUrl: string;
  link: string;
};

type AnimationSet = {
  _id: string;
  name: string;
  category: string;
  animations: Animation[];
  paid: boolean;
  price: number;
};

export default function UserAnimationSetsPage() {
  const { user: clerkUser,isLoaded } = useUser();
  const clerkId = clerkUser?.id;

  const { user } = useUserAuth(clerkId);

  const [sets, setSets] = useState<AnimationSet[]>([]);
  const [loading, setLoading] = useState(true);
  const [addingSetId, setAddingSetId] = useState<string | null>(null);

  // Fetch all animation sets
  const fetchSets = async () => {
    if(!clerkId) return
    
    
    setLoading(true);
    try {
      const res = await fetch("/api/v1/user/addAnimationSet/"+clerkId);
      if (!res.ok) throw new Error("Failed to load animation sets");
      const data = await res.json();
      setSets(data || []);
    } catch (err: any) {
      toast.error(err.message || "Failed to load sets");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSets();
  }, [user]);

  const handlePickSet = async (setId: string) => {
    if (!isLoaded || !user) {
      toast.error("You must be signed in to get a set");
      return;
    }

    
    if (!clerkId) {
      toast.error("User ID not found");
      return;
    }

    setAddingSetId(setId);

    try {
      const res = await fetch(`/api/v1/peeko/pickAnimationSet/${user.userCode}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ animationSetId: setId }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "Failed to add set");
      }

      toast.success("Animation set added to your collection! 🎉");
    } catch (err: any) {
      toast.error(err.message || "Failed to add set");
    } finally {
      setAddingSetId(null);
    }
  };

  if (!isLoaded) {
    return <div className="text-center py-20">Loading user...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto py-12 px-6">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Animation Sets Gallery</h1>
        <p className="text-xl text-muted-foreground">
          Browse and add animation packs to your collection
        </p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="rounded-2xl border bg-card p-6 animate-pulse shadow-lg"
            >
              <div className="h-10 bg-muted rounded mb-4" />
              <div className="grid grid-cols-3 gap-3 mb-6">
                {[...Array(6)].map((_, j) => (
                  <div key={j} className="aspect-square bg-muted rounded-lg" />
                ))}
              </div>
              <div className="h-12 bg-muted rounded" />
            </div>
          ))}
        </div>
      ) : sets.length === 0 ? (
        <div className="text-center py-20 border rounded-2xl bg-muted/30">
          <p className="text-2xl text-muted-foreground">No animation sets available yet</p>
          <p className="mt-4">Check back soon!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {sets && sets.map((set) => (
            <div
              key={set._id}
              className="rounded-2xl border bg-card shadow-lg overflow-hidden hover:shadow-2xl transition-shadow"
            >
              {/* Header */}
              <div className="p-6 border-b bg-gradient-to-r from-primary/5 to-secondary/5">
                <h3 className="text-2xl font-bold text-center">{set.name}</h3>
                <p className="text-center text-muted-foreground mt-2 capitalize">
                  {set.category}
                </p>
              </div>

              {/* Animations Grid */}
              <div className="p-6">
                <div className="grid grid-cols-3 gap-4 mb-8">
                  {set.animations.length > 0 ? (
                    set.animations.map((anim) => (
                      <div
                        key={anim._id}
                        className="relative aspect-square rounded-xl overflow-hidden border bg-muted"
                      >
                        <Image
                          src={anim.imageUrl}
                          alt={anim.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ))
                  ) : (
                    <p className="col-span-3 text-center text-muted-foreground">
                      No animations
                    </p>
                  )}
                </div>

                {/* Price & Button */}
                <div className="space-y-4">
                  <div className="text-center">
                    {set.paid ? (
                      <p className="text-3xl font-bold text-primary">
                        ${set.price.toFixed(2)}
                      </p>
                    ) : (
                      <p className="text-2xl font-semibold text-green-600">Free</p>
                    )}
                  </div>

                  <Button
                    size="lg"
                    className="w-full"
                    onClick={() => handlePickSet(set._id)}
                    disabled={addingSetId === set._id}
                  >
                    {addingSetId === set._id ? (
                      <>
                        <Check className="mr-2 h-5 w-5 animate-pulse" />
                        Adding to Peeko...
                      </>
                    ) : (
                      "Use Set"
                    )}
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}