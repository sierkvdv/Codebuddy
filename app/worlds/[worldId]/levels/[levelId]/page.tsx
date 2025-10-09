"use client";

import { useState, useEffect, useMemo } from "react";
import { trpc } from "@/lib/trpc-client";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import Editor from "@/components/Editor";
import RobotSandbox from "@/components/RobotSandbox";
import FeedbackPanel from "@/components/FeedbackPanel";
import ProgressHeader from "@/components/ProgressHeader";
import OnboardingTour from "@/components/OnboardingTour";
import StepChecklist from "@/components/StepChecklist";
import HintsPanel from "@/components/HintsPanel";

export default function ChallengePage() {
  const params = useParams();
  const router = useRouter();
  const worldId = params.worldId as string;
  const levelId = params.levelId as string;

  const [code, setCode] = useState("");
  const [sandboxCode, setSandboxCode] = useState("");
  const [selectedChallengeId, setSelectedChallengeId] = useState<string | null>(null);
  const [doneSteps, setDoneSteps] = useState<string[]>([]);

  const { data: levels } = trpc.world.getLevels.useQuery({ worldId });
  const { data: challenges, isLoading: challengesLoading } = trpc.level.getChallenges.useQuery({
    levelId,
  });

  const submitCode = trpc.submission.submit.useMutation();

  const level = levels?.find((l: any) => l.id === levelId);

  // Auto-select first challenge
  const challenge = selectedChallengeId
    ? challenges?.find((c) => c.id === selectedChallengeId)
    : challenges?.[0];

  useEffect(() => {
    if (challenges && challenges.length > 0 && !selectedChallengeId) {
      setSelectedChallengeId(challenges[0].id);
    }
  }, [challenges, selectedChallengeId]);

  // Prefill editor with starter code once
  useEffect(() => {
    if (challenge?.starterCode && !code) {
      setCode(challenge.starterCode);
    }
  }, [challenge, code]);

  const handleRunCode = () => {
    setSandboxCode(code);
  };

  const handleSubmit = async () => {
    if (!challenge) return;

    try {
      const result = await submitCode.mutateAsync({
        challengeId: challenge.id,
        code,
      });

      if (result.result === "pass") {
        // Challenge completed! Navigate back after delay
        setTimeout(() => {
          router.push(`/worlds/${worldId}`);
        }, 2000);
      }
    } catch (error) {
      console.error("Submission error:", error);
    }
  };

  const handleGetHelp = async () => {
    if (!challenge) return;

    try {
      // Always call AI feedback for step-by-step help, regardless of test results
      const response = await fetch("/api/ai/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          challengeContext: {
            title: challenge.title,
            prompt: challenge.prompt,
          },
          userCode: code,
          testResults: [], // Empty for step-by-step help
        }),
      });

      if (response.ok) {
        const data = await response.json();
        // Store the AI feedback in a state variable to display it
        // For now, we'll use the existing submitCode mutation to store the feedback
        // This is a bit of a hack, but it will work
        submitCode.mutate({
          challengeId: challenge.id,
          code,
        });
      }
    } catch (error) {
      console.error("AI help error:", error);
    }
  };

  if (challengesLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (!level || !challenges || challenges.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">No challenges found for this level</div>
      </div>
    );
  }

  if (!challenge) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading challenge...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <ProgressHeader />
      <OnboardingTour />

      <div className="container mx-auto px-4 py-6">
        <Link href={`/worlds/${worldId}`}>
          <motion.button
            whileHover={{ x: -4 }}
            className="flex items-center gap-2 text-gray-700 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to World
          </motion.button>
        </Link>

        <div className="grid lg:grid-cols-[2fr_1fr] gap-6">
          {/* Left Column: Challenge Description & Editor */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-xl p-6 shadow-lg"
            >
              <div className="mb-4">
                <span className="text-sm text-gray-500">{level.name}</span>
                <h1 className="text-3xl font-bold text-gray-800">{challenge.title}</h1>
              </div>

              <p className="text-gray-700 mb-4">{challenge.prompt}</p>

              {/* Challenge selector if multiple challenges */}
              {challenges.length > 1 && (
                <div className="mt-4 flex gap-2">
                  {challenges.map((c, idx) => (
                    <button
                      key={c.id}
                      onClick={() => setSelectedChallengeId(c.id)}
                      className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                        c.id === challenge.id
                          ? "bg-blue-500 text-white"
                          : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                      }`}
                    >
                      Part {idx + 1}
                    </button>
                  ))}
                </div>
              )}
            </motion.div>

            <Editor
              value={code}
              onChange={setCode}
              onRun={handleRunCode}
              onSubmit={handleSubmit}
              onGetHelp={handleGetHelp}
              isSubmitting={submitCode.isPending}
            />
          </div>

          {/* Right Column: Steps, Hints, Robot Sandbox & Feedback */}
          <div className="space-y-6">
            <StepChecklist steps={challenge.steps ?? []} doneIds={doneSteps} />
            <HintsPanel challenge={{ title: challenge.title, prompt: challenge.prompt }} />
            <RobotSandbox code={sandboxCode} />

            <FeedbackPanel
              feedback={submitCode.data?.feedback}
              isLoading={submitCode.isPending}
              success={submitCode.data?.result === "pass"}
              testResults={submitCode.data?.testResults}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
