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
          "Let me help you step by step! First, understand what we need: check if a number is positive (bigger than 0).",
          "Step 1: Type 'function isPositive(num) {' - this starts your function.",
          "Step 2: Type 'return num > 0;' - this checks if bigger than 0 and gives back the answer.",
          "Step 3: Type '}' - this closes your function.",
        ],
        encouragement: "You can do this! Let's build it step by step! 🚀",
      });
    }

    // Prepare context for AI
    const failedTests = testResults.filter((t) => !t.passed);
    const testSummary = testResults.length > 0 
      ? failedTests
          .map(
            (t, i) =>
              `Test ${i + 1}: Expected ${JSON.stringify(t.expected)} but got ${JSON.stringify(
                t.actual
              )} for input ${JSON.stringify(t.input)}${
                t.error ? ` (Error: ${t.error})` : ""
              }`
          )
          .join("\n")
      : "No test results provided - this is a step-by-step help request.";

    const prompt = `You are CodeBuddy, a VERY patient step-by-step tutor for absolute beginners who know NOTHING about programming.

A student is working on this coding challenge:
Title: "${challengeContext.title}"
Challenge: "${challengeContext.prompt}"

They submitted this code:
\`\`\`javascript
${userCode}
\`\`\`

Their code failed these tests:
${testSummary}

The student clicked "Show me the answer" - they want step-by-step help like a personal tutor. Guide them through it:

1. First, explain what the function should do in simple words
2. Then, show them step by step what to type
3. Explain what each part does
4. Be encouraging and patient

Example response:
"Let me help you step by step! 

First, let's understand what we need: we want to check if a number is positive (bigger than 0).

Step 1: Start with the function name
Type: function isPositive(num) {

Step 2: Check if the number is bigger than 0
Type: return num > 0;

Step 3: Close the function
Type: }

The > symbol means 'is bigger than'. Return gives back the answer (true or false).

Your complete function should look like:
function isPositive(num) {
  return num > 0;
}

Try typing this step by step!"

Be VERY patient and encouraging. Guide them like a personal tutor.`;

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
          "I'm having trouble analyzing your code right now. Let me help you step by step! First, understand what we need: check if a number is positive (bigger than 0). Step 1: Type 'function isPositive(num) {' - this starts your function. Step 2: Type 'return num > 0;' - this checks if bigger than 0 and gives back the answer. Step 3: Type '}' - this closes your function.",
        hints: [
          "Let me help you step by step! First, understand what we need: check if a number is positive (bigger than 0).",
          "Step 1: Type 'function isPositive(num) {' - this starts your function.",
          "Step 2: Type 'return num > 0;' - this checks if bigger than 0 and gives back the answer.",
          "Step 3: Type '}' - this closes your function.",
        ],
        encouragement: "You can do this! Let's build it step by step! 🚀",
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
    return `Your code has an error: ${firstFailed.error}. Let me help you step by step! 

First, understand what we need: check if a number is positive (bigger than 0).

Step 1: Type 'function isPositive(num) {' - this starts your function.
Step 2: Type 'return num > 0;' - this checks if bigger than 0 and gives back the answer.
Step 3: Type '}' - this closes your function.

The > symbol means 'is bigger than'. Return gives back the answer (true or false).`;
  }

  return `Not quite there! Let me help you step by step! 

First, understand what we need: check if a number is positive (bigger than 0).

Step 1: Type 'function isPositive(num) {' - this starts your function.
Step 2: Type 'return num > 0;' - this checks if bigger than 0 and gives back the answer.
Step 3: Type '}' - this closes your function.

The > symbol means 'is bigger than'. Return gives back the answer (true or false).`;
}
