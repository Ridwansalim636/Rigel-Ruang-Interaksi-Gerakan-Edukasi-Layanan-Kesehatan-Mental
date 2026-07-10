'use client';

import { useState } from 'react';
import ReactMarkdown from 'react-markdown';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: string;
}

export default function CoPilotPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Halo! Aku Co-Pilot AI RIGEL. Ruang aman tempatmu bisa curhat privat atau tanya-tanya apa saja seputar kesehatan mental dan perkuliahan. Ada yang lagi mengganjal di pikiranmu?',
      sender: 'ai',
      timestamp: 'Sekarang',
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const quickTemplates = [
    "🚀 Tips bagi waktu kuliah & organisasi",
    "📚 Stres tugas kuliah menumpuk",
    "☕ Cara ngatasin burnout belajar",
  ];

  const sendMessageToAPI = async (textToSend: string) => {
    if (!textToSend.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: textToSend,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInputText('');
    setIsTyping(true);

    try {
      // Formating data agar sesuai dengan API Gemini
      const formattedHistory = updatedMessages.map(msg => ({
        role: msg.sender === 'user' ? 'user' : 'model',
        parts: [{ text: msg.text }]
      }));

      const response = await fetch('/api/edu', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ history: formattedHistory }), 
      });

      if (!response.ok) throw new Error('Network response was not ok');

      const data = await response.json();
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: data.reply || 'Ada sedikit gangguan sinyal, Wan. Coba ketik lagi ya.',
        sender: 'ai',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      
      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error("Error saat fetch ke API:", error);
      // Menambah pesan error agar terlihat di chat
      const errorMessage: Message = {
        id: Date.now().toString(),
        text: "Maaf, sepertinya koneksi ke server sedang bermasalah. Coba lagi nanti ya.",
        sender: 'ai',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessageToAPI(inputText);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0B132B] via-[#1C2541] to-[#3A506B] text-white font-sans flex flex-col justify-between">
      <div className="border-b border-white/10 backdrop-blur-md bg-[#0B132B]/60 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <div className="bg-cyan-500/20 text-cyan-400 p-2 rounded-lg border border-cyan-500/30 w-10 h-10 flex items-center justify-center font-bold">🤖</div>
          <div>
            <h1 className="text-lg font-bold text-cyan-400 tracking-wide">Co-Pilot Chat (AI)</h1>
            <p className="text-xs text-slate-400">Teman Curhat & Asisten Akademik Privatmu</p>
          </div>
        </div>
        <a href="/" className="text-xs text-slate-400 hover:text-cyan-400 border border-white/10 px-3 py-1.5 rounded-md backdrop-blur-sm transition-all">← Kembali ke Dashboard</a>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-4 max-w-3xl w-full mx-auto">
        <div className="backdrop-blur-lg bg-white/[0.03] border border-white/10 rounded-2xl p-4 min-h-[55vh] flex flex-col shadow-2xl justify-between">
          <div className="space-y-4 overflow-y-auto max-h-[50vh] pr-2">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
                <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm shadow-md transition-all ${msg.sender === 'user' ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-br-none shadow-cyan-500/10' : 'bg-white/10 text-slate-200 rounded-bl-none border border-white/5'}`}>
                  <div className="prose prose-invert text-sm max-w-none break-words">
                    <ReactMarkdown>{msg.text}</ReactMarkdown>
                  </div>
                </div>
                <span className="text-[10px] text-slate-500 mt-1 px-1">{msg.timestamp}</span>
              </div>
            ))}
            {isTyping && (
              <div className="flex flex-col items-start">
                <div className="bg-white/10 text-slate-400 rounded-2xl rounded-bl-none px-4 py-2.5 text-sm border border-white/5 flex items-center gap-1.5">
                  <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></span>
                  <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                  <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="p-6 max-w-3xl w-full mx-auto sticky bottom-0 bg-gradient-to-t from-[#3A506B] via-[#3A506B]/90 to-transparent space-y-3">
        <div className="flex flex-wrap gap-2 justify-center">
          {quickTemplates.map((template, idx) => (
            <button key={idx} type="button" onClick={() => sendMessageToAPI(template)} className="text-xs bg-white/5 hover:bg-cyan-500/20 border border-white/10 hover:border-cyan-500/40 px-3 py-1.5 rounded-full transition-all text-slate-300 hover:text-cyan-400 active:scale-95">
              {template}
            </button>
          ))}
        </div>
        <form onSubmit={handleFormSubmit} className="relative flex items-center">
          <input type="text" value={inputText} onChange={(e) => setInputText(e.target.value)} placeholder="Ketik curhatanmu di sini secara privat..." className="w-full bg-[#0B132B]/80 border border-white/10 focus:border-cyan-400 rounded-xl py-3.5 pl-4 pr-14 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-400/20 transition-all backdrop-blur-md shadow-inner" />
          <button type="submit" className="absolute right-2 bg-cyan-500 hover:bg-cyan-400 text-white p-2 rounded-lg font-bold transition-all shadow-lg shadow-cyan-500/20 active:scale-95 flex items-center justify-center w-9 h-9">🚀</button>
        </form>
        <p className="text-center text-[10px] text-slate-400/60">🔒 Obrolan ini bersifat privat dan dienkripsi secara aman.</p>
      </div>
    </div>
  );
}