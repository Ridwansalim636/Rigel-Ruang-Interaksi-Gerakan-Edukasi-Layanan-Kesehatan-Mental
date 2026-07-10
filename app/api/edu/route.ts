import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const apiKey = process.env.GOOGLE_GENAI_API_KEY;
    
    // Diagnosa 1: Apakah Key terdeteksi?
    if (!apiKey) {
      return NextResponse.json({ reply: "Error: API Key tidak ditemukan di environment variables." }, { status: 500 });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const body = await req.json();
    const prompt = body.history[body.history.length - 1].parts[0].text;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    
    return NextResponse.json({ reply: response.text() });
  } catch (error: any) {
    // Diagnosa 2: Menampilkan pesan error asli dari Google AI ke chat
    return NextResponse.json({ reply: "Error Google AI: " + error.message }, { status: 500 });
  }
}