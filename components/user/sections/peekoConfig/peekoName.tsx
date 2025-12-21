"use client";

import { useEffect, useState } from "react";
import { toast } from "react-toastify";

interface Props {
  peekoCode: string;
  initialName?: string;
}

export default function PeekoName({ peekoCode, initialName = "" }: Props) {
  const [name, setName] = useState(initialName);
  const [loading, setLoading] = useState(false);
  console.log(initialName)
  const updateName = async () => {
    if (!name.trim()) return toast.error("Name cannot be empty");

    setLoading(true);
    try {
      const res = await fetch(`/api/v1/peeko/name/${peekoCode}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ peekoName: name }),
      });

      if (!res.ok) throw new Error("Failed to update name");
      toast.success("Peeko name updated 🐣");
    } catch {
      toast.error("Error updating Peeko name");
    } finally {
      setLoading(false);
    }
  };

  useEffect(()=>{
    setName(initialName)
  },[initialName])
  return (
    <div className="w-full max-w-md mx-auto p-4">
      <label className="block text-sm font-medium mb-2">Peeko Name</label>
      <div className="flex gap-2">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="flex-1 rounded-lg border px-3 py-2 text-sm"
          placeholder="My Peeko"
        />
        <button
          onClick={updateName}
          disabled={loading}
          className="rounded-lg bg-primary px-4 py-2 text-white text-sm"
        >
          Save
        </button>
      </div>
    </div>
  );
}
