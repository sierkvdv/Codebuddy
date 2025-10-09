import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { z } from "zod";

/**
 * AI Feedback API Route
 * POST /api/ai/feedback
 * 
 * Constructs a prompt for OpenAI API and returns structured feedback.
 * If no OPENAI_API_KEY is present, returns a mock response.
 */

// Input validation schema
const AIFeedbackInputSchema = z.object({
  challengeContext: z.object({
    title: z.string(),
    prompt: z.string(),
  }),
  userCode: z.string(),
  testResults: z.array(
    z.object({
      passed: z.boolean(),
      input: z.any(),
      expected: z.any(),
      actual: z.any().optional(),
      error: z.string().optional(),
    })
  ),
});

// Check if OpenAI API key is configured
const hasOpenAIKey = !!process.env.OPENAI_API_KEY;

const openai = hasOpenAIKey
  ? new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    })
  : null;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validatedInput = AIFeedbackInputSchema.parse(body);

    const { challengeContext, userCode, testResults } = validatedInput;

    // If no OpenAI key, return mock response
    if (!hasOpenAIKey || !openai) {
      return NextResponse.json({
        message: getMockFeedback(testResults),
        hints: [
          "Type this: return num > 0; This means: give back true if num is bigger than 0, false if not.",
          "The > checks if bigger, return gives back the answer.",
          "Write: function isPositive(num) { return num > 0; }",
        ],
        encouragement: "You can do this! Here's exactly what to type! 🚀",
      });
    }

    // Prepare context for AI
    const failedTests = testResults.filter((t) => !t.passed);
    const testSummary = failedTests
      .map(
        (t, i) =>
          `Test ${i + 1}: Expected ${JSON.stringify(t.expected)} but got ${JSON.stringify(
            t.actual
          )} for input ${JSON.stringify(t.input)}${
            t.error ? ` (Error: ${t.error})` : ""
          }`
      )
      .join("\n");

    const prompt = `You are CodeBuddy, a VERY patient tutor for absolute beginners who know NOTHING about programming.

A student is working on this coding challenge:
Title: "${challengeContext.title}"
Challenge: "${challengeContext.prompt}"

They submitted this code:
\`\`\`javascript
${userCode}
\`\`\`

Their code failed these tests:
${testSummary}

The student is COMPLETELY LOST and needs EXACT help. Give them:

1. What they should type EXACTLY (show the actual code)
2. Why it works in simple words
3. What each part does

Examples of good responses:
- "Type this: return num > 0; This means: give back true if num is bigger than 0, false if not. The > checks if bigger, return gives back the answer."
- "Write: function isPositive(num) { return num > 0; } The > checks if bigger, return gives back the answer."

Be VERY specific. Show the actual code they need to type. They are absolute beginners!`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content:
            "You are CodeBuddy, a friendly AI coding tutor for complete beginners. You provide clear, encouraging feedback without technical jargon. You give hints, not solutions.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 300,
    });

    const message =
      completion.choices[0]?.message?.content ||
      "Keep trying! You're on the right track.";

    // Extract hints (simplified - in production could parse AI response)
    const hints = [
      "Review the test cases carefully",
      "Check your return statement",
      "Make sure you're handling all edge cases",
    ];

    return NextResponse.json({
      message,
      hints,
      encouragement: "You've got this! Every coder faces challenges. Keep going! 💪",
    });
  } catch (error) {
    console.error("AI Feedback error:", error);

    // Return helpful fallback response on error
    return NextResponse.json(
      {
        message:
          "I'm having trouble analyzing your code right now. Here's exactly what to type: return num > 0; This means: give back true if num is bigger than 0, false if not.",
        hints: [
          "Type this: return num > 0; This means: give back true if num is bigger than 0, false if not.",
          "The > checks if bigger, return gives back the answer.",
          "Write: function isPositive(num) { return num > 0; }",
        ],
        encouragement: "You can do this! Here's exactly what to type! 🚀",
      },
      { status: 200 } // Still return 200 to not break the flow
    );
  }
}

/**
 * Generate mock feedback based on test results
 * Used when OpenAI API is not configured
 */
function getMockFeedback(testResults: any[]): string {
  const failedCount = testResults.filter((t) => !t.passed).length;
  const totalCount = testResults.length;

  if (failedCount === 0) {
    return "Great job! All tests passed!";
  }

  const failedTests = testResults.filter((t) => !t.passed);
  const firstFailed = failedTests[0];

  if (firstFailed.error) {
    return `Your code has an error: ${firstFailed.error}. Here's what to type: return num > 0; This means: give back true if num is bigger than 0, false if not.`;
  }

  return `Not quite there! Here's exactly what to type: return num > 0; This means: give back true if num is bigger than 0, false if not. The > checks if bigger, return gives back the answer.`;
}
