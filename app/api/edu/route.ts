import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENAI_API_KEY || '');

export async function POST(req: Request) {
  try {
    const { history } = await req.json(); // Sekarang menerima 'history' dari frontend
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    // Mengambil pesan terakhir dari history untuk konteks
    const lastMessage = history[history.length - 1].parts[0].text;

    const result = await model.generateContent(lastMessage);
    const response = await result.response;
    const text = response.text();

    return NextResponse.json({ reply: text });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json({ reply: "Maaf, sedang ada kendala teknis." }, { status: 500 });
  }
}