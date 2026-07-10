import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { history } = body;

    if (!process.env.GOOGLE_GENAI_API_KEY) {
      throw new Error("API Key tidak ditemukan di environment variables!");
    }

    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENAI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    // Mengambil pesan terakhir dari history yang diformat oleh frontend
    const lastMessage = history[history.length - 1].parts[0].text;

    const result = await model.generateContent(lastMessage);
    const response = await result.response;
    const text = response.text();

    return NextResponse.json({ reply: text });
  } catch (error: any) {
    console.error("DEBUG ERROR API:", error.message);
    // Mengembalikan error agar kita bisa baca di console log Vercel
    return NextResponse.json({ reply: `Error: ${error.message}` }, { status: 500 });
  }
}