import { GoogleGenAI } from '@google/genai';
import { NextResponse } from 'next/server';

// Hapus baris lama, ganti dengan ini:
const ai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_GENAI_API_KEY,
});
export async function POST(req: Request) {
  let requestedTopic = 'materi';
  
  try {
    const { topic } = await req.json();

    if (!topic) {
      return NextResponse.json({ error: 'Topik tidak boleh kosong' }, { status: 400 });
    }
    
    requestedTopic = topic;

    const prompt = `Anda adalah seorang dosen ahli, teman dekat, kerabat, sekaligus keluarga yang sangat hangat bagi mahasiswa. 
    Berikan edukasi lengkap yang interaktif mengenai topik: "${topic}".
    
    Ketentuan Penting Penulisan (HARUS DIPATUHI):
    1. Selalu awali bagian ringkasan/summary dengan sapaan hangat: "Halo Sobat Dirgantara!" lalu berikan kalimat penyemangat yang menyentuh hati sebelum masuk ke materi.
    2. DILARANG KERAS menggunakan karakter bintang (seperti *, **, ***) di dalam teks "summary" maupun "explanation". Jika ingin menegaskan kata, gunakan huruf kapital atau tanda kutip biasa saja. Teks harus bersih dari logo bintang!
    3. Deteksi Topik:
       - Jika topik seputar KESEHATAN MENTAL/PSIKOLOGI (burnout, stres, cemas, minder, dll), fokus pada solusi emosional yang menenangkan dan set nilai "flashcards" menjadi array kosong []. Jangan berikan kuis.
       - Jika topik berupa MATERI KULIAH TEKNIK (Elektro, Dirgantara, Informatika, Mesin, Industri, Aeronautika), buatkan tepat 5 flashcards pilihan ganda yang mendalam.
    4. Video URL: Cari atau buatkan perkiraan ID video YouTube edukasi yang nyata dan relevan dengan topik (misal tentang edukasi materi tersebut). Format harus berupa URL embed YouTube yang valid dan bisa diputar, contoh: https://www.youtube.com/embed/dQw4w9WgXcQ (ganti ID di belakang embed/ dengan ID video asli yang relevan jika memungkinkan, atau gunakan link edukasi umum yang aktif).

    Anda harus menghasilkan output dalam format JSON murni dengan struktur berikut tanpa bungkusan markdown (\`\`\`json):
    {
      "isMentalHealth": true atau false,
      "summary": "Teras narasi penjelasan bersih tanpa tanda bintang sama sekali di sini.",
      "videoUrl": "https://www.youtube.com/embed/ID_VIDEO_YOUTUBE",
      "flashcards": [
        {
          "id": 1,
          "question": "Pertanyaan pilihan ganda teknik",
          "options": ["Pilihan A", "Pilihan B", "Pilihan C", "Pilihan D"],
          "correctAnswer": "Isi pilihan yang benar",
          "explanation": "Penjelasan detail tanpa menggunakan tanda bintang sama sekali."
        }
      ]
    }
    
    Jika materi teknik, pastikan isi array flashcards berjumlah tepat 5 soal!`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    let textClean = response.text?.trim() || '{}';
    
    // Antispasi jika Gemini nakal menyelipkan bungkusan markdown ```json ... ```
    if (textClean.startsWith('```')) {
      textClean = textClean.replace(/^```json/, '').replace(/^```/, '').replace(/```$/, '').trim();
    }

    const parsedData = JSON.parse(textClean);

    // Proteksi pembersihan karakter bintang tambahan di sisi backend jika AI lupa
    if (parsedData.summary) {
      parsedData.summary = parsedData.summary.replace(/\*/g, '');
    }
    if (parsedData.flashcards) {
      parsedData.flashcards = parsedData.flashcards.map((card: any) => ({
        ...card,
        explanation: card.explanation ? card.explanation.replace(/\*/g, '') : ''
      }));
    }

    return NextResponse.json(parsedData);
  } catch (error) {
    console.error('Error In-Flight Edu:', error);
    return NextResponse.json({ 
      isMentalHealth: false,
      summary: `Halo Sobat Dirgantara! Sistem sempat mengalami gangguan pembacaan data untuk materi ${requestedTopic}. Silakan klik tombol terbang sekali lagi ya untuk memuat ulang!`,
      videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", // Fallback video aman
      flashcards: [] 
    });
  }
}