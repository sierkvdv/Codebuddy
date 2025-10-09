"use client";
import { useState } from "react";

export default function HintsPanel({ challenge }:{ challenge:{ title:string; prompt:string } }) {
  const [loading, setLoading] = useState(false);
  const [hint, setHint] = useState<string | null>(null);

  async function getHint() {
    setLoading(true);
    setHint(null);
    const res = await fetch("/api/ai/hint", {
      method: "POST",
      headers: {"Content-Type":"application/json"},
      body: JSON.stringify({ challengeContext: { title: challenge.title, prompt: challenge.prompt } })
    });
    const json = await res.json();
    setHint(json.hint || "Think step by step…");
    setLoading(false);
  }

  return (
    <div className="bg-white rounded-xl p-4 shadow-sm space-y-3">
      <h3 className="font-semibold">Need a hint?</h3>
      <button
        onClick={getHint}
        disabled={loading}
        className="px-3 py-2 rounded-lg bg-amber-500 text-white disabled:opacity-60"
      >
                {loading ? "Thinking…" : "Get Hint"}
      </button>
      {hint && <div className="text-sm text-gray-800">{hint}</div>}
    </div>
  );
}
