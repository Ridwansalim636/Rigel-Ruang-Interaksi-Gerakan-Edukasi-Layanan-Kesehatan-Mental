import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error("API Key tidak ditemukan!");
      return NextResponse.json({ reply: "Konfigurasi server salah." }, { status: 500 });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const body = await req.json();
    const chatHistory = body.history;
    const prompt = chatHistory[chatHistory.length - 1].parts[0].text;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return NextResponse.json({ reply: text });
  } catch (error: any) {
    console.error("Error Detail:", error);
    return NextResponse.json({ reply: "Mohon maaf, sistem sedang sibuk." }, { status: 500 });
  }
}