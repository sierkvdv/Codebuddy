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
      hint: "Try comparing the input with 0 and return that comparison.",
      microStep: "Write: return num > 0;"
    });
  }

  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });
  const prompt = `
You are a friendly tutor for absolute beginners. Give one short hint (max 2 sentences),
no code solution. Challenge: "${challengeContext.title}"
Goal: ${challengeContext.prompt}
User step focus: ${step ?? "n/a"}
User code (may be empty):\n${userCode ?? "<empty>"}\n
Return only a concise hint and (if helpful) a tiny micro-step.
`;

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.5,
    max_tokens: 120
  });

  const text = completion.choices[0]?.message?.content?.trim()
    ?? "Think about comparing the number to 0.";
  return NextResponse.json({ hint: text });
}
