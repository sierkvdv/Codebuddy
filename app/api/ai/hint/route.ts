import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { z } from "zod";

const Schema = z.object({
  challengeContext: z.object({
    title: z.string(),
    prompt: z.string()
  }),
  userCode: z.string().optional(),
  step: z.string().optional()
});

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { challengeContext, userCode, step } = Schema.parse(body);

  const hasKey = !!process.env.OPENAI_API_KEY;
  if (!hasKey) {
    return NextResponse.json({
      hint: "Type this: return num > 0; This means: give back true if num is bigger than 0, false if not. The > checks if bigger, return gives back the answer."
    });
  }

  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });
  const prompt = `
You are a VERY patient tutor for absolute coding beginners. They know NOTHING about programming.

Challenge: "${challengeContext.title}"
Goal: ${challengeContext.prompt}
User code: ${userCode ?? "<empty>"}

The user is completely lost and needs EXACT help. Give them:

1. What they should type EXACTLY (show the code)
2. Why it works in simple words
3. What each part does

Examples:
- "Type this: return num > 0; This means: give back true if num is bigger than 0, false if not."
- "Write: function isPositive(num) { return num > 0; } The > checks if bigger, return gives back the answer."

Be VERY specific. Show the actual code they need to type.
`;

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.5,
    max_tokens: 120
  });

  const text = completion.choices[0]?.message?.content?.trim()
    ?? "Type this: return num > 0; This means: give back true if num is bigger than 0, false if not.";
  return NextResponse.json({ hint: text });
}
