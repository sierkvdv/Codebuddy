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
          "Check your logic step by step",
          "Make sure your function returns the correct value",
          "Review the challenge requirements carefully",
        ],
        encouragement: "Keep practicing! You're making progress! 🚀",
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

    const prompt = `You are CodeBuddy, a friendly and encouraging coding tutor for absolute beginners.

A student is working on this coding challenge:
Title: "${challengeContext.title}"
Challenge: "${challengeContext.prompt}"

They submitted this code:
\`\`\`javascript
${userCode}
\`\`\`

Their code failed these tests:
${testSummary}

Provide helpful, beginner-friendly feedback that:
1. Explains what went wrong in simple terms (avoid technical jargon)
2. Gives a specific hint about how to fix it (without giving away the full solution)
3. Encourages them to keep trying
4. Uses friendly, supportive language

Keep your response under 150 words and make it conversational.`;

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
          "I'm having trouble analyzing your code right now. Try checking your logic step by step and comparing it to the challenge requirements!",
        hints: [
          "Review the challenge prompt carefully",
          "Test your code with the sample inputs",
          "Check your function's return value",
        ],
        encouragement: "Don't give up! Keep experimenting! 🚀",
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
    return `Your code has an error: ${firstFailed.error}. Try reviewing your syntax and logic.`;
  }

  return `Not quite there! You passed ${totalCount - failedCount} out of ${totalCount} tests. For the input ${JSON.stringify(
    firstFailed.input
  )}, your code returned ${JSON.stringify(
    firstFailed.actual
  )} but we expected ${JSON.stringify(
    firstFailed.expected
  )}. Review your logic and try again!`;
}
