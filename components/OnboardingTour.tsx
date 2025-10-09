"use client";
import { useEffect, useState } from "react";

export default function OnboardingTour() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const seen = localStorage.getItem("tour_seen");
    if (!seen) setShow(true);
  }, []);
  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
      <div className="bg-white rounded-2xl p-6 w-[480px] space-y-4">
        <h2 className="text-2xl font-bold">Welcome! 👋</h2>
        <ol className="list-decimal ml-5 space-y-2 text-gray-700">
          <li>Read the challenge in simple words.</li>
          <li>Type your code in the editor — we pre-filled a starting point.</li>
          <li>Press <b>Run Code</b>. Need help? Click <b>Hint</b>.</li>
        </ol>
        <button
          onClick={() => { localStorage.setItem("tour_seen", "1"); setShow(false); }}
          className="px-4 py-2 rounded-lg bg-indigo-600 text-white"
        >
          Let's start
        </button>
      </div>
    </div>
  );
}
