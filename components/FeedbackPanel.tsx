"use client";

import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, XCircle, Loader2, Lightbulb, AlertCircle, ArrowRight, Heart } from "lucide-react";

interface FeedbackPanelProps {
  feedback?: string;
  isLoading?: boolean;
  success?: boolean;
  testResults?: Array<{
    passed: boolean;
    input: any;
    expected: any;
    actual?: any;
    error?: string;
  }>;
  hints?: string[];
  encouragement?: string;
}

/**
 * FeedbackPanel Component
 * Displays AI feedback returned by server with:
 * - Verdict (pass/fail)
 * - Issues (what went wrong)
 * - Hints (how to improve)
 * - Next steps (what to do next)
 * - Encouragement (motivational message)
 */
export default function FeedbackPanel({ feedback, isLoading, success, testResults, hints, encouragement }: FeedbackPanelProps) {
  // Parse feedback to extract sections (if formatted)
  const parseFeedback = () => {
    if (!feedback) return null;

    // Use provided hints and encouragement, or fall back to parsing
    const sections = {
      verdict: success ? "All tests passed! Great work! 🎉" : "Not quite there yet",
      issues: [] as string[],
      hints: hints || [] as string[],
      nextSteps: [] as string[],
      encouragement: encouragement || "Keep going! You're learning!",
    };

    // Extract hints (lines starting with "💡", "Hint:", etc.)
    const lines = feedback.split("\n");
    lines.forEach((line) => {
      if (line.includes("💡") || line.toLowerCase().includes("hint")) {
        sections.hints.push(line.replace(/💡|Hint:/gi, "").trim());
      } else if (line.toLowerCase().includes("try") || line.toLowerCase().includes("check")) {
        sections.nextSteps.push(line.trim());
      }
    });

    // Main message
    sections.issues = [feedback];

    return sections;
  };

  const feedbackSections = parseFeedback();

  // Extract failed test issues
  const failedTests = testResults?.filter((t) => !t.passed) || [];
  const passedTests = testResults?.filter((t) => t.passed) || [];

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.4 }}
      className="bg-white rounded-xl shadow-lg p-6"
    >
      <div className="flex items-center gap-2 mb-4">
        <Lightbulb className="w-5 h-5 text-yellow-500" />
        <h3 className="text-xl font-semibold text-gray-800">AI Feedback</h3>
      </div>

      <AnimatePresence mode="wait">
        {isLoading ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center justify-center py-8"
          >
            <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
            <span className="ml-3 text-gray-600">Analyzing your code...</span>
          </motion.div>
        ) : feedback && feedbackSections ? (
          <motion.div
            key="feedback"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-4"
          >
            {/* Verdict */}
            <div
              className={`flex items-start gap-3 p-4 rounded-lg border-2 ${
                success
                  ? "bg-green-50 border-green-200"
                  : "bg-orange-50 border-orange-200"
              }`}
            >
              {success ? (
                <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
              ) : (
                <XCircle className="w-6 h-6 text-orange-600 flex-shrink-0 mt-0.5" />
              )}
              <div>
                <h4 className={`font-bold text-lg ${success ? "text-green-800" : "text-orange-800"}`}>
                  {feedbackSections.verdict}
                </h4>
                {testResults && testResults.length > 0 && (
                  <p className={`text-sm mt-1 ${success ? "text-green-700" : "text-orange-700"}`}>
                    {passedTests.length} / {testResults.length} tests passed
                  </p>
                )}
              </div>
            </div>

            {/* Issues (what went wrong) */}
            {!success && failedTests.length > 0 && (
              <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <AlertCircle className="w-5 h-5 text-red-600" />
                  <h5 className="font-semibold text-red-800">Issues Found</h5>
                </div>
                <ul className="space-y-2">
                  {failedTests.slice(0, 3).map((test, idx) => (
                    <li key={idx} className="text-sm text-red-700">
                      <div className="flex items-start gap-2">
                        <span className="text-red-400 mt-0.5">•</span>
                        <div>
                          <p className="font-medium">Test {idx + 1} failed:</p>
                          <p className="text-red-600 font-mono text-xs mt-1">
                            Input: {JSON.stringify(test.input)}
                          </p>
                          <p className="text-red-600 font-mono text-xs">
                            Expected: {JSON.stringify(test.expected)} but got{" "}
                            {JSON.stringify(test.actual)}
                          </p>
                          {test.error && (
                            <p className="text-red-500 font-mono text-xs mt-1">
                              Error: {test.error}
                            </p>
                          )}
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Main Feedback Message */}
            <div className="prose prose-sm max-w-none">
              <p className="text-gray-700 leading-relaxed">{feedback}</p>
            </div>

            {/* Hints */}
            {feedbackSections.hints.length > 0 && (
              <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Lightbulb className="w-5 h-5 text-blue-600" />
                  <h5 className="font-semibold text-blue-800">Hints</h5>
                </div>
                <ul className="space-y-1">
                  {feedbackSections.hints.map((hint, idx) => (
                    <li key={idx} className="text-sm text-blue-700 flex items-start gap-2">
                      <span className="text-blue-400 mt-0.5">💡</span>
                      <span>{hint}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Next Steps */}
            {feedbackSections.nextSteps.length > 0 && (
              <div className="bg-purple-50 border-2 border-purple-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <ArrowRight className="w-5 h-5 text-purple-600" />
                  <h5 className="font-semibold text-purple-800">Next Steps</h5>
                </div>
                <ul className="space-y-1">
                  {feedbackSections.nextSteps.map((step, idx) => (
                    <li key={idx} className="text-sm text-purple-700 flex items-start gap-2">
                      <span className="text-purple-400 mt-0.5">→</span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Encouragement */}
            <div
              className={`flex items-start gap-3 p-4 rounded-lg ${
                success ? "bg-green-50 border-2 border-green-200" : "bg-pink-50 border-2 border-pink-200"
              }`}
            >
              <Heart
                className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                  success ? "text-green-600 fill-green-600" : "text-pink-600 fill-pink-600"
                }`}
              />
              <p className={`text-sm ${success ? "text-green-800" : "text-pink-800"}`}>
                {success
                  ? "Amazing work! You're becoming a great coder! Keep it up! 🌟"
                  : "Don't give up! Every coder faces challenges. You're learning with each attempt! 💪"}
              </p>
            </div>

            {/* Additional Tips for Failed Attempts */}
            {!success && (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                <p className="text-xs text-gray-600">
                  <strong>Tip:</strong> Try running your code first to see the output, then compare it
                  with what's expected. Small changes can make a big difference!
                </p>
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center py-8"
          >
            <div className="text-6xl mb-4">🤖</div>
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Ready to Help!</h4>
            <p className="text-gray-600">
              Submit your code to get AI-powered feedback, hints, and encouragement!
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
