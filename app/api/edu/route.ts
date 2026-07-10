import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log("DEBUG: Data diterima backend:", body); // Cek ini di Vercel Logs!

    const apiKey = process.env.GOOGLE_GENAI_API_KEY;
    if (!apiKey) {
      console.error("DEBUG: API Key kosong!");
      return NextResponse.json({ reply: "API Key belum diset di Vercel." }, { status: 500 });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    // Ambil teks dari struktur yang dikirim frontend
    const prompt = body.history[0].parts[0].text;
    const result = await model.generateContent(prompt);
    const response = await result.response;
    
    return NextResponse.json({ reply: response.text() });
  } catch (error: any) {
    console.error("DEBUG: Error Backend:", error);
    return NextResponse.json({ reply: "Error backend: " + error.message }, { status: 500 });
  }
}