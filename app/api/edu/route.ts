import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const apiKey = process.env.GOOGLE_GENAI_API_KEY;
    if (!apiKey) {
      throw new Error("API_KEY_NOT_FOUND");
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' }); // Gunakan versi flash yang lebih stabil

    const body = await req.json();
    const prompt = body.history[body.history.length - 1].parts[0].text;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return NextResponse.json({ reply: response.text() });
  } catch (error: any) {
    return NextResponse.json({ reply: "Error: " + error.message }, { status: 500 });
  }
}