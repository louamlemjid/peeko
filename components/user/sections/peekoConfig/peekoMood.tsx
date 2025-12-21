"use client";

import { useEffect, useState } from "react";
import { toast } from "react-toastify";
export enum PeekoMood {
  DEFAULT = "DEFAULT",
  HAPPY = "HAPPY",
  TIRED = "TIRED",
  ANGRY = "ANGRY",
}

const MOODS: PeekoMood[] = [
  PeekoMood.DEFAULT,
  PeekoMood.HAPPY,
  PeekoMood.TIRED,
  PeekoMood.ANGRY,
];

interface Props {
  peekoCode: string;
  initialMood: PeekoMood;
}

export default function PeekoMoodSection({ peekoCode, initialMood }: Props) {
  const [mood, setMood] = useState<PeekoMood>(initialMood);
  const [loading, setLoading] = useState(false);

  const updateMood = async (selectedMood: PeekoMood) => {
    setMood(selectedMood);
    setLoading(true);

    try {
      const res = await fetch(`/api/v1/peeko/mood/${peekoCode}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mood: selectedMood }),
      });

      if (!res.ok) throw new Error();
      toast.success(`Mood set to ${selectedMood} 🎭`);
    } catch {
      toast.error("Failed to update mood");
    } finally {
      setLoading(false);
    }
  };

  useEffect(()=>{
    setMood(initialMood)
  },[initialMood])

  return (
    <div className="w-full max-w-md mx-auto p-4">
      <p className="text-sm font-medium mb-3">Peeko Mood</p>

      <div className="grid grid-cols-2 gap-3">
        {MOODS.map((m) => (
          <label
            key={m}
            className={`flex items-center justify-center rounded-xl border p-4 text-sm cursor-pointer transition
              ${mood === m ? "bg-primary text-white" : "bg-background"}`}
          >
            <input
              type="radio"
              name="mood"
              value={m}
              checked={mood === m}
              onChange={() => updateMood(m)}
              className="hidden"
              disabled={loading}
            />
            {m}
          </label>
        ))}
      </div>
    </div>
  );
}
