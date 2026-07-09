// @ts-nocheck
'use client';

import { useState } from 'react';
import { createClient } from '@supabase/supabase-js';

// Inisialisasi koneksi Supabase menggunakan file .env.local kamu
const supabaseUrl = 'https://jedaehkuoijphgkinqoq.supabase.co';
const supabaseKey = 'sb_publishable_5ZQ_y00_zTyufEXXPWl3JA_AgPNKpnT';
const supabase = createClient(supabaseUrl, supabaseKey);

export default function RigelLandingPage() {
  // State untuk Mood Tracker
  const [mood, setMood] = useState(null);
  const [statusMessage, setStatusMessage] = useState("Selamat datang di Dek Penerbangan RIGEL. Bagaimana kondisi 'cuaca' hatimu saat ini?");

  // State untuk Formulir Laporan ITDA Care
  const [nama, setNama] = useState('');
  const [keluhan, setKeluhan] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fungsi saat mahasiswa memilih mood
  const handleMoodSelect = (selectedMood) => {
    setMood(selectedMood);
    if (selectedMood === 'turbulence') {
      setStatusMessage("🚨 Sistem mendeteksi 'Turbulence' (Lelah/Sedih). Kencangkan sabuk pengamanmu, kamu berada di ruang yang aman. Silakan tulis keluh kesahmu di bawah.");
    } else {
      setStatusMessage("✈️ Sistem mendeteksi 'Clear Sky' (Senang/Stabil). Penerbangan berjalan lancar! Pertahankan energi positifmu dan bagikan ceritamu.");
    }
  };

  // Fungsi kirim data ASLI ke Supabase
 const handleSubmitLaporan = async (e) => {
  e.preventDefault();
  setIsSubmitting(true);

  try {
    // Memastikan data dikirim dengan format text murni yang aman bagi Supabase
    const dataInput = {
      name: String(nama || 'Anonim'),
      mood_score: String(mood || 'Clear Sky'),
      keluh_kesah: String(keluhan || 'Tidak ada pesan')
    };

    const { error } = await supabase
      .from('reporst')
      .insert([dataInput]);

    if (error) throw error;

    alert('🚀 Laporan berhasil dikirim ke ITDA Care!');
    // Reset form setelah sukses
    setNama('');
    setKeluhan('');
    setMood(null);
    setStatusMessage('Selamat datang di Ground Control ITDA Care.');
  } catch (err) {
    console.error('Error mengirim data:', err.message);
    alert('Waduh, ada kendala koneksi ke database. Pastikan RLS Policy di Supabase sudah diset ke INSERT.');
  } finally {
    setIsSubmitting(false);
  }
};

return (
    <div className="min-h-screen bg-gradient-to-b from-[#0B132B] via-[#1C2541] to-[#3A506B] text-white font-sans">
      
      {/* HEADER / NAVIGATION BAR */}
      <header className="border-b border-white/10 backdrop-blur-md sticky top-0 z-50 bg-[#0B132B]/80 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Logo Icon RIGEL */}
          <div className="bg-cyan-500 p-2 rounded-lg shadow-lg shadow-cyan-500/20 flex items-center justify-center w-10 h-10">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-6 h-6 text-white"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L6 12zm0 0h7.5"
              />
            </svg>
          </div>

          {/* Teks Nama Program & Kepanjangan */}
          <div className="flex flex-col">
            <span className="text-xl font-bold tracking-wider text-cyan-400 leading-none">
              RIGEL
            </span>
            <span className="text-[10px] text-slate-400 font-medium leading-none mt-1 mb-0.5">
              Ruang Interaksi Gerakan Edukasi & Layanan Kesehatan Mental
            </span>
            <span className="text-[11px] text-slate-300 font-semibold tracking-widest uppercase">
              PUTRA PUTRI DIRGANTARA × ITDA CARE
            </span>
          </div>
        </div>

        <nav className="hidden md:flex space-x-6 text-sm font-medium text-slate-300">
          <a href="/" className="hover:text-cyan-400 transition-colors">The Launchpad</a>
          <a href="/co-pilot" className="hover:text-cyan-400 transition-colors">Co-Pilot Chat (AI)</a>
          <a href="/in-flight-edu" className="hover:text-cyan-400 transition-colors">In-Flight Edu</a>
          <a href="/itda-care" className="hover:text-cyan-400 transition-colors font-bold text-cyan-400">ITDA Care</a>
        </nav>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-12 space-y-16">
        
        {/* HERO SECTION - Suasana Penyambutan */}
        <section className="text-center space-y-6 max-w-3xl mx-auto pt-4">
          <div className="inline-flex items-center space-x-2 bg-white/5 border border-white/10 rounded-full px-4 py-1.5 text-xs text-cyan-300 backdrop-blur-sm">
            <span>🛡️ Ruang Aman Mahasiswa Institut Teknologi Dirgantara Adisutjipto</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-200 to-cyan-300">
            Ketika Mental Melemah, Kemanapun Kamu Terbang, Kami Adalah Tempatmu Mendarat.
          </h1>
          <p className="text-base md:text-lg text-slate-300 leading-relaxed">
            RIGEL (Ruang Interaksi Gerakan Edukasi & Layanan) hadir sebagai <span className="text-cyan-300 font-semibold">Co-Pilot</span> setiamu. Tempat bercerita, memetakan suasana hati, dan terhubung langsung secara resmi dengan layanan konseling <span className="font-semibold text-white">ITDA Care</span>.
          </p>
        </section>

        {/* INTERACTIVE MOOD TRACKER - Panel Instrumen Penerbangan */}
        <section className="bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8 backdrop-blur-md shadow-2xl relative overflow-hidden">
          <div className="text-center space-y-4">
            <h2 className="text-xl font-bold tracking-wide text-cyan-400 font-mono">📊 FLIGHT INDICATOR (MOOD TRACKER)</h2>
            <p className="text-sm md:text-base text-slate-200 max-w-xl mx-auto transition-all duration-300 bg-white/5 py-3 px-4 rounded-xl border border-white/5">
              {statusMessage}
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-4">
              <button 
                type="button"
                onClick={() => handleMoodSelect('turbulence')}
                className={`w-full sm:w-52 py-4 px-6 rounded-xl border font-semibold flex items-center justify-center space-x-3 transition-all ${
                  mood === 'turbulence' 
                    ? 'bg-red-500/20 border-red-500 text-red-300 shadow-lg' 
                    : 'bg-white/5 border-white/10 text-slate-300 hover:bg-red-500/10'
                }`}
              >
                <span className="text-xl">🚨</span>
                <div className="text-left">
                  <span className="block text-sm font-bold">Turbulence</span>
                  <span className="block text-[10px] opacity-70">Merasa Lelah / Sedih</span>
                </div>
              </button>

              <button 
                type="button"
                onClick={() => handleMoodSelect('clearsky')}
                className={`w-full sm:w-52 py-4 px-6 rounded-xl border font-semibold flex items-center justify-center space-x-3 transition-all ${
                  mood === 'clearsky' 
                    ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 shadow-lg' 
                    : 'bg-white/5 border-white/10 text-slate-300 hover:bg-emerald-500/10'
                }`}
              >
                <span className="text-xl">✈️</span>
                <div className="text-left">
                  <span className="block text-sm font-bold">Clear Sky</span>
                  <span className="block text-[10px] opacity-70">Merasa Senang / Stabil</span>
                </div>
              </button>
            </div>
          </div>
        </section>

        {/* FORMULIR PRA-KONSULTASI ITDA CARE */}
        <section className="bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8 backdrop-blur-md shadow-2xl">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            
            <div className="md:w-1/3 space-y-4">
              <div className="bg-cyan-500/10 border border-cyan-500/20 rounded-xl p-4 space-y-3">
                <h3 className="text-base font-bold text-cyan-400 flex items-center space-x-2">
                  <span>🏢</span>
                  <span>Ground Control (ITDA Care)</span>
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Jangan memendam beban sendirian. Melalui formulir laporan terenkripsi ini, keluhanmu akan langsung tercatat secara sistematis. 
                </p>
                <p className="text-xs text-cyan-300 font-medium">
                  💡 Saat kamu butuh janji temu tatap muka langsung ke ITDA Care, data keluhan ini sudah tersimpan rapi untuk mempermudah konseling.
                </p>
              </div>
              <div className="text-[11px] text-slate-400 font-mono pl-2">
                Program Kerja resmi Kedutaan Putra Putri Dirgantara Institut Teknologi Dirgantara Adisutjipto Yogyakarta.
              </div>
            </div>

            <div className="w-full md:w-2/3">
              <form onSubmit={handleSubmitLaporan} className="space-y-4">
                <h3 className="text-lg font-bold tracking-wide">Formulir Pelaporan Keluh Kesah</h3>
                
                <div>
                  <label className="block text-xs font-mono tracking-wider text-slate-400 mb-1">NAMA / NIM (BISA DIOSONGKAN / ANONIM)</label>
                  <input 
                    type="text" 
                    value={nama}
                    onChange={(e) => setNama(e.target.value)}
                    placeholder="Contoh: Mahasiswa Teknik Dirgantara / Anonim"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-cyan-500 text-white transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono tracking-wider text-slate-400 mb-1">TULISKAN KELUH KESAH ATAU APA YANG SEDANG KAMU RASAKAN *</label>
                  <textarea 
                    required
                    rows={4}
                    value={keluhan}
                    onChange={(e) => setKeluhan(e.target.value)}
                    placeholder="Tumpahkan semua yang mengganjal di pikiranmu di sini... Ruang ini sepenuhnya milikmu."
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-cyan-500 text-white transition-colors resize-none"
                  ></textarea>
                </div>

                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full sm:w-auto bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-semibold px-8 py-3 rounded-xl transition-all shadow-lg text-sm disabled:opacity-50"
                >
                  {isSubmitting ? 'Mengirim Data Terenkripsi...' : '🚀 Kirim Laporan & Simpan ke ITDA Care'}
                </button>
              </form>
            </div>

          </div>
        </section>

      </main>

      <footer className="border-t border-white/5 mt-16 py-8 px-6 text-center text-xs text-slate-500 font-mono">
        © 2026 RIGEL - Ruang Interaksi Gerakan Edukasi & Layanan Kesehatan Mental. Built with Next.js, Tailwind CSS, Supabase, and Vercel.
      </footer>
    </div>
  );
}