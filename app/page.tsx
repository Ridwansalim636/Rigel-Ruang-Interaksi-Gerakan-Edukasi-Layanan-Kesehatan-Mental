'use client';

import React, { useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://jedaehkuoijphgkinqoq.supabase.co';
const supabaseKey = 'sb_publishable_5ZQ_y00_zTyufEXXPWl3JA_AgPNKpnT';
const supabase = createClient(supabaseUrl, supabaseKey);

export default function RigelLandingPage() {
  const [mood, setMood] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string>("Selamat datang di Dek Penerbangan RIGEL.");
  const [nama, setNama] = useState<string>('');
  const [keluhan, setKeluhan] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleMoodSelect = (selectedMood: string) => {
    setMood(selectedMood);
    setStatusMessage(selectedMood === 'turbulence' ? "🚨 Sistem mendeteksi 'Turbulence'." : "✈️ Sistem mendeteksi 'Clear Sky'.");
  };

  const handleSubmitLaporan = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const { error } = await supabase.from('reporst').insert([{
        name: nama || 'Anonim',
        mood_score: mood || 'Clear Sky',
        keluh_kesah: keluhan
      }]);
      if (error) throw error;
      alert('Laporan berhasil!');
      setNama(''); setKeluhan(''); setMood(null);
    } catch (err) {
      alert('Gagal mengirim data.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0b1221] text-white p-6">
      <main className="max-w-2xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold">RIGEL Landing Page</h1>
        
        <section className="bg-white/5 p-6 rounded-xl border border-white/10">
          <p className="mb-4">{statusMessage}</p>
          <div className="flex gap-4">
            <button onClick={() => handleMoodSelect('turbulence')} className="bg-red-500/20 px-4 py-2 rounded">Turbulence</button>
            <button onClick={() => handleMoodSelect('clearsky')} className="bg-emerald-500/20 px-4 py-2 rounded">Clear Sky</button>
          </div>
        </section>

        <form onSubmit={handleSubmitLaporan} className="space-y-4">
          <input type="text" value={nama} onChange={(e) => setNama(e.target.value)} placeholder="Nama" className="w-full bg-white/5 p-3 rounded" />
          <textarea value={keluhan} onChange={(e) => setKeluhan(e.target.value)} placeholder="Keluhan" className="w-full bg-white/5 p-3 rounded" />
          <button type="submit" className="bg-cyan-600 px-6 py-3 rounded font-bold">Kirim</button>
        </form>
      </main>
    </div>
  );
}