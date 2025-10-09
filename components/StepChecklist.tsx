"use client";
type Step = { id: string; title: string; tip?: string };
export default function StepChecklist({ steps = [], doneIds = [] as string[] }:{
  steps: Step[]; doneIds?: string[];
}) {
  return (
    <div className="bg-white rounded-xl p-4 shadow-sm">
      <h3 className="font-semibold mb-2">Steps</h3>
      <ul className="space-y-2">
        {steps.map(s => (
          <li key={s.id} className="flex items-start gap-2">
            <span className={`mt-1 inline-block h-3 w-3 rounded-full ${doneIds.includes(s.id) ? "bg-green-500" : "bg-gray-300"}`} />
            <div>
              <div className="text-sm font-medium">{s.title}</div>
              {s.tip && <div className="text-xs text-gray-500">{s.tip}</div>}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
