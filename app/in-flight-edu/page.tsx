'use client';

import { useState } from 'react';

export default function InFlightEduPage() {
  const [topic, setTopic] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [summary, setSummary] = useState('');
  const [links, setLinks] = useState<any[]>([]); // Mengganti videoUrl dengan links
  const [flashcards, setFlashcards] = useState<any[]>([]);
  const [isMentalHealth, setIsMentalHealth] = useState(false);
  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: number]: string }>({});

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;

    setIsLoading(true);
    setSelectedAnswers({});
    
    try {
      const response = await fetch('/api/edu', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic: topic }),
      });

      const data = await response.json();
      setSummary(data.summary || '');
      setLinks(data.links || []); // Mengambil links dari API
      setFlashcards(data.flashcards || []);
      setIsMentalHealth(data.isMentalHealth || false);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectOption = (cardId: number, option: string) => {
    if (selectedAnswers[cardId]) return;
    setSelectedAnswers(prev => ({ ...prev, [cardId]: option }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0B132B] via-[#1C2541] to-[#3A506B] text-white font-sans p-6">
      
      {/* HEADER */}
      <div className="max-w-4xl w-full mx-auto flex items-center justify-between border-b border-white/10 pb-4 mb-6">
        <div>
          <h1 className="text-xl font-bold text-cyan-400 tracking-wide">📚 In-Flight Edu Hub</h1>
          <p className="text-xs text-slate-400">Pusat Informasi, Referensi & Kuis Interaktif AI</p>
        </div>
        <a href="/" className="text-xs text-slate-400 hover:text-cyan-400 border border-white/10 px-3 py-1.5 rounded-md backdrop-blur-sm transition-all">
          ← Kembali
        </a>
      </div>

      <div className="max-w-4xl w-full mx-auto space-y-8">
        
        {/* INPUT FORM */}
        <div className="backdrop-blur-lg bg-white/[0.03] border border-white/10 rounded-2xl p-6 shadow-2xl">
          <h2 className="text-sm font-semibold text-slate-300 mb-3">Mau belajar apa hari ini?</h2>
          <form onSubmit={handleGenerate} className="flex gap-2">
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Contoh: Avionik Pesawat, Kalkulus Integral..."
              className="flex-1 bg-[#0B132B]/80 border border-white/10 focus:border-cyan-400 rounded-xl px-4 py-3 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-400/20 transition-all"
            />
            <button
              type="submit"
              disabled={isLoading}
              className="bg-cyan-500 hover:bg-cyan-400 text-white px-6 py-3 rounded-xl font-bold text-sm transition-all shadow-lg shadow-cyan-500/20 active:scale-95 disabled:opacity-50"
            >
              {isLoading ? 'Memproses...' : '⚡ Terbang'}
            </button>
          </form>
        </div>

        {/* SUMMARY & LINKS SECTION */}
        {summary && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 bg-white/[0.02] border border-white/5 rounded-2xl p-6 space-y-3">
              <h3 className="text-sm font-bold text-cyan-400 tracking-wider uppercase">
                {isMentalHealth ? '🌱 Ruang Edukasi & Pengingat Nyaman:' : '📖 Penjelasan Ringkasan Materi:'}
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-line">{summary}</p>
            </div>

            <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-6 flex flex-col space-y-3">
              <h3 className="text-sm font-bold text-rose-400 tracking-wider uppercase mb-2">🔗 Link Referensi:</h3>
              <div className="space-y-2">
                {links && links.length > 0 ? (
                  links.map((link: any, index: number) => (
                    <a 
                      key={index} 
                      href={link.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="block text-xs text-cyan-400 hover:text-cyan-300 hover:underline transition-all"
                    >
                      {link.title}
                    </a>
                  ))
                ) : (
                  <p className="text-xs text-slate-500">Tidak ada referensi tambahan.</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* QUIZ SECTION */}
        {!isMentalHealth && flashcards.length > 0 && (
          <div className="space-y-4 pt-4">
            <h3 className="text-sm font-bold text-emerald-400 tracking-wider uppercase">🃏 Uji Pemahamanmu (5 Soal Interaktif):</h3>
            <div className="grid grid-cols-1 gap-6">
              {flashcards.map((card, index) => {
                const userAnswer = selectedAnswers[card.id];
                const isCorrect = userAnswer === card.correctAnswer;

                return (
                  <div key={card.id} className="bg-white/[0.03] border border-white/10 p-6 rounded-2xl space-y-4 shadow-xl">
                    <div>
                      <span className="text-xs font-bold bg-cyan-500/10 text-cyan-400 px-2.5 py-1 rounded-md">Soal {index + 1} dari 5</span>
                    </div>
                    <p className="text-base font-medium text-slate-200">{card.question}</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {card.options.map((option: string) => {
                        let btnStyle = "bg-[#0B132B]/50 border-white/10 text-slate-300 hover:bg-white/5";
                        if (userAnswer) {
                          if (option === card.correctAnswer) btnStyle = "bg-emerald-500/20 border-emerald-500 text-emerald-400 font-semibold";
                          else if (option === userAnswer && !isCorrect) btnStyle = "bg-rose-500/20 border-rose-500 text-rose-400 line-through";
                          else btnStyle = "bg-gray-800/20 border-white/5 text-slate-500 opacity-60";
                        }
                        return (
                          <button
                            key={option}
                            onClick={() => handleSelectOption(card.id, option)}
                            disabled={!!userAnswer}
                            className={`w-full text-left px-4 py-3 rounded-xl border text-sm transition-all duration-200 ${btnStyle}`}
                          >
                            {option}
                          </button>
                        );
                      })}
                    </div>

                    {userAnswer && (
                      <div className="mt-4 border-t border-white/5 pt-4">
                        <div className={`text-xs font-bold uppercase tracking-wide mb-1 ${isCorrect ? 'text-emerald-400' : 'text-rose-400'}`}>
                          {isCorrect ? '🎉 Jawabanmu Benar!' : '❌ Jawabanmu Kurang Tepat!'}
                        </div>
                        <p className="text-xs text-slate-400 leading-relaxed bg-black/20 p-3 rounded-xl border border-white/5">
                          <span className="font-semibold text-slate-300">Pembahasan:</span> {card.explanation}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}