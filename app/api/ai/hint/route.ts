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
      hint: "Think about: what happens when you compare 5 with 0? Try: write 'return' and then something with >"
    });
  }

  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });
  const prompt = `
You are a VERY patient tutor for absolute coding beginners. They know NOTHING about programming.

Challenge: "${challengeContext.title}"
Goal: ${challengeContext.prompt}
User code: ${userCode ?? "<empty>"}

Give a SUPER SIMPLE hint in English. Use words like:
- "Think about..." 
- "Try..."
- "Use..."

Make it like talking to a 10-year-old. NO technical jargon.
Examples of good hints:
- "Think about: what happens when you compare 5 with 0?"
- "Try: write 'return' and then something with >"
- "Use: the word 'true' or 'false'"

Keep it to 1-2 sentences maximum.
`;

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.5,
    max_tokens: 120
  });

  const text = completion.choices[0]?.message?.content?.trim()
    ?? "Think about: compare the number with 0. Try: use > to check if it's bigger.";
  return NextResponse.json({ hint: text });
}
