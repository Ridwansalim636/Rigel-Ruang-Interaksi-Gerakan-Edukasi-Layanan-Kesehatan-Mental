import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENAI_API_KEY || '');

export async function POST(req: Request) {
  try {
    const body = await req.json();
    // Kita ambil history dari body
    const history = body.history;

    if (!history || !Array.isArray(history)) {
      return NextResponse.json({ reply: "Format data salah." }, { status: 400 });
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    
    // Ambil pesan terakhir
    const lastMessage = history[history.length - 1].parts[0].text;

    const result = await model.generateContent(lastMessage);
    const response = await result.response;
    return NextResponse.json({ reply: response.text() });
  } catch (error) {
    return NextResponse.json({ reply: "Gagal memproses AI." }, { status: 500 });
  }
}