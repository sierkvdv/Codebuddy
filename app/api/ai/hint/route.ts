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
      hint: "Denk aan: wat gebeurt er als je 5 met 0 vergelijkt? Probeer: schrijf 'return' en dan iets met >"
    });
  }

  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });
  const prompt = `
You are a VERY patient tutor for absolute coding beginners. They know NOTHING about programming.

Challenge: "${challengeContext.title}"
Goal: ${challengeContext.prompt}
User code: ${userCode ?? "<empty>"}

Give a SUPER SIMPLE hint in Dutch. Use words like:
- "Denk aan..." (Think about...)
- "Probeer..." (Try...)
- "Gebruik..." (Use...)

Make it like talking to a 10-year-old. NO technical jargon.
Examples of good hints:
- "Denk aan: wat gebeurt er als je 5 met 0 vergelijkt?"
- "Probeer: schrijf 'return' en dan iets met >"
- "Gebruik: het woord 'true' of 'false'"

Keep it to 1-2 sentences maximum.
`;

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.5,
    max_tokens: 120
  });

  const text = completion.choices[0]?.message?.content?.trim()
    ?? "Denk aan: vergelijk het getal met 0. Probeer: gebruik > om te kijken of het groter is.";
  return NextResponse.json({ hint: text });
}
