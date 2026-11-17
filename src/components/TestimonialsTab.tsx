import { useEffect, useState } from 'react';
import { apiRequest } from '../lib/cloudflareApi';

// Tab admin "Testimoni Website": admin mengunggah testimoni untuk section
// testimoni di landing page (di atas CTA). Website menampilkan 3 testimoni
// terbaru.
//
// Form batch: 3 testimoni sekaligus (1, 2, 3) — masing-masing foto, nama,
// quotes, keterangan — disimpan semua dengan SATU klik.
//
// Quote ditulis SATU kolom dalam bentuk paragraf berurutan sesuai urutan
// bahasa website: paragraf 1 = Inggris, 2 = Mandarin, 3 = Spanyol,
// 4 = Indonesia, 5 = Jepang, 6 = Prancis, 7 = Arab, 8 = Rusia, 9 = Korea,
// 10 = Portugis. Bahasa yang kosong otomatis memakai quote bahasa lain
// yang terisi (utama: Indonesia).

type Testimonial = {
  id: number;
  name: string;
  quote: string;
  quotes: Record<string, string> | null;
  photo: string | null;
  detail: string | null;
  created_at: string;
};

type Entry = {
  name: string;
  quotesText: string;
  detail: string;
  photo: string | null;
};

const emptyEntry = (): Entry => ({ name: '', quotesText: '', detail: '', photo: null });

const LOCALES: Array<{ code: string; label: string }> = [
  { code: 'en-US', label: 'Inggris' },
  { code: 'zh-CN', label: 'Mandarin' },
  { code: 'es-ES', label: 'Spanyol' },
  { code: 'id-ID', label: 'Indonesia' },
  { code: 'ja-JP', label: 'Jepang' },
  { code: 'fr-FR', label: 'Prancis' },
  { code: 'ar-SA', label: 'Arab' },
  { code: 'ru-RU', label: 'Rusia' },
  { code: 'ko-KR', label: 'Korea' },
  { code: 'pt-PT', label: 'Portugis' },
];

// Pisahkan teks menjadi paragraf: utamakan baris kosong (Enter 2x) sebagai
// pemisah; bila tidak ada, tiap baris dianggap satu paragraf.
function splitParagraphs(text: string): string[] {
  const byBlank = text.split(/\n\s*\n/).map((s) => s.trim()).filter(Boolean);
  if (byBlank.length > 1) return byBlank;
  return text.split(/\n/).map((s) => s.trim()).filter(Boolean);
}

function toQuotesMap(text: string): Record<string, string> {
  const map: Record<string, string> = {};
  splitParagraphs(text).slice(0, 10).forEach((seg, i) => { map[LOCALES[i].code] = seg; });
  return map;
}

export default function TestimonialsTab() {
  const [items, setItems] = useState<Testimonial[]>([]);
  const [entries, setEntries] = useState<Entry[]>([emptyEntry(), emptyEntry(), emptyEntry()]);
  const [busy, setBusy] = useState(false);
  const [note, setNote] = useState('');
  const [hidden, setHidden] = useState<boolean | null>(null);
  const [visBusy, setVisBusy] = useState(false);

  const setEntry = (idx: number, patch: Partial<Entry>) =>
    setEntries((prev) => prev.map((e, i) => (i === idx ? { ...e, ...patch } : e)));

  const load = async () => {
    try {
      const res = await apiRequest<{ data: Testimonial[] }>('/api/admin/testimonials');
      setItems(res.data || []);
    } catch (e: any) {
      setNote(e?.message || 'Gagal memuat testimoni.');
    }
    try {
      const vis = await apiRequest<{ hidden: boolean }>('/api/admin/testimonials-visibility');
      setHidden(!!vis.hidden);
    } catch { /* status tampil/sembunyi tidak kritis */ }
  };

  const toggleVisibility = async () => {
    if (hidden === null) return;
    setVisBusy(true);
    try {
      const res = await apiRequest<{ hidden: boolean }>('/api/admin/testimonials-visibility', { body: { hidden: !hidden } });
      setHidden(!!res.hidden);
      setNote(res.hidden ? 'Section testimoni disembunyikan dari website.' : 'Section testimoni ditampilkan lagi di website.');
    } catch (e: any) {
      setNote(e?.message || 'Gagal mengubah tampilan section.');
    } finally { setVisBusy(false); }
  };

  useEffect(() => { load(); }, []);

  const handlePhoto = (idx: number, file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const scale = Math.min(1, 480 / Math.max(img.width, img.height));
        canvas.width = Math.max(1, Math.round(img.width * scale));
        canvas.height = Math.max(1, Math.round(img.height * scale));
        canvas.getContext('2d')?.drawImage(img, 0, 0, canvas.width, canvas.height);
        setEntry(idx, { photo: canvas.toDataURL('image/webp', 0.85) });
      };
      img.src = String(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const submit = async () => {
    // Tiap blok: lengkap (nama + minimal 1 paragraf quote), kosong penuh
    // (dilewati), atau sebagian (ditolak supaya tidak ada yang menggantung).
    const states = entries.map((e) => {
      const filled = Boolean(e.name.trim() || e.quotesText.trim() || e.detail.trim() || e.photo);
      const complete = Boolean(e.name.trim() && splitParagraphs(e.quotesText).length > 0);
      return { filled, complete };
    });
    const partialIdx = states.findIndex((s) => s.filled && !s.complete);
    if (partialIdx >= 0) {
      setNote(`Testimoni ${partialIdx + 1} belum lengkap — nama dan minimal satu paragraf quote wajib diisi, atau kosongkan bloknya sekalian.`);
      return;
    }
    const completeIdx = states.map((s, i) => (s.complete ? i : -1)).filter((i) => i >= 0);
    if (completeIdx.length === 0) {
      setNote('Belum ada testimoni yang lengkap untuk disimpan.');
      return;
    }
    setBusy(true);
    try {
      for (const i of completeIdx) {
        const e = entries[i];
        await apiRequest('/api/admin/testimonials', {
          body: { name: e.name.trim(), quotes: toQuotesMap(e.quotesText), detail: e.detail.trim(), photo: e.photo },
        });
      }
      setEntries([emptyEntry(), emptyEntry(), emptyEntry()]);
      setNote(`${completeIdx.length} testimoni tersimpan dan tampil di website untuk semua bahasa.`);
      await load();
    } catch (e: any) {
      setNote(e?.message || 'Gagal menyimpan testimoni.');
    } finally { setBusy(false); }
  };

  const remove = async (id: number) => {
    if (!window.confirm('Hapus testimoni ini dari website?')) return;
    try {
      await apiRequest(`/api/admin/testimonials/${id}`, { method: 'DELETE' });
      await load();
    } catch (e: any) {
      setNote(e?.message || 'Gagal menghapus testimoni.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="p-4 rounded-2xl bg-neutral-900/40 border border-neutral-800/80 flex items-center justify-between gap-4 flex-wrap">
        <div className="min-w-0">
          <p className="text-sm font-bold text-white">Section testimoni di website</p>
          <p className="text-[11px] text-neutral-400 mt-0.5 leading-relaxed">
            {hidden === null
              ? 'Memuat status…'
              : hidden
                ? 'Status: SEMBUNYI — testimoni tetap tersimpan di sini, tapi tidak tampil di website.'
                : 'Status: TAMPIL — testimoni tampil di website (di atas CTA).'}
          </p>
        </div>
        <button
          type="button"
          onClick={toggleVisibility}
          disabled={visBusy || hidden === null}
          className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0"
        >
          {visBusy ? 'Menyimpan…' : hidden ? 'Tampilkan Section' : 'Sembunyikan Section'}
        </button>
      </div>

      <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/25 text-amber-200 text-xs leading-relaxed">
        Isi hanya testimoni dari orang asli — foto, nama, dan kata-kata mereka sendiri. Website menampilkan <b>3 testimoni terbaru</b> di section testimoni (di atas CTA).
      </div>

      <div className="space-y-4">
        <h3 className="text-sm font-bold text-white">Tambah Testimoni — isi sampai 3 sekaligus, satu klik simpan</h3>

        {entries.map((entry, idx) => {
          const segments = splitParagraphs(entry.quotesText);
          return (
            <div key={idx} className="p-6 rounded-3xl bg-neutral-900/40 border border-neutral-800/80 space-y-4">
              <h4 className="text-xs font-bold text-neutral-300 uppercase tracking-wide">Testimoni {idx + 1}{idx > 0 ? ' (opsional)' : ''}</h4>

              <div className="flex items-center gap-4">
                {entry.photo ? (
                  <img src={entry.photo} alt={`Foto testimoni ${idx + 1}`} className="w-16 h-16 rounded-full object-cover border border-neutral-700" />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-neutral-800 border border-neutral-700 flex items-center justify-center text-neutral-500 text-[10px] text-center px-1">Belum ada foto</div>
                )}
                <div className="space-y-2">
                  <label className="inline-block px-3 py-2 bg-neutral-800 hover:bg-neutral-700 text-white rounded-xl text-xs font-bold cursor-pointer transition-all">
                    Upload Foto {idx + 1}
                    <input type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) handlePhoto(idx, f); e.target.value = ''; }} />
                  </label>
                  {entry.photo && (
                    <button type="button" onClick={() => setEntry(idx, { photo: null })} className="block text-[11px] text-red-400 hover:text-red-300 cursor-pointer">Hapus foto</button>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-300 mb-1.5">Nama {idx + 1}</label>
                <input value={entry.name} onChange={(e) => setEntry(idx, { name: e.target.value })} maxLength={100} placeholder="Nama pemberi testimoni" className="w-full h-11 bg-neutral-950 border border-neutral-800 rounded-xl px-4 text-sm text-white focus:outline-none focus:border-indigo-400" />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-300 mb-1.5">Quotes {idx + 1} — 10 bahasa (satu paragraf per bahasa, urut)</label>
                <textarea
                  value={entry.quotesText}
                  onChange={(e) => setEntry(idx, { quotesText: e.target.value })}
                  rows={8}
                  placeholder={'Tulis atau paste semua quote di sini, satu paragraf per bahasa.\n\nParagraf 1 = Inggris\nParagraf 2 = Mandarin\nParagraf 3 = Spanyol\nParagraf 4 = Indonesia\nParagraf 5 = Jepang\nParagraf 6 = Prancis\nParagraf 7 = Arab\nParagraf 8 = Rusia\nParagraf 9 = Korea\nParagraf 10 = Portugis'}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-400 resize-y"
                />
                <p className="text-[10px] text-neutral-500 mt-1 leading-relaxed">
                  Urutan: 1 Inggris · 2 Mandarin · 3 Spanyol · 4 Indonesia · 5 Jepang · 6 Prancis · 7 Arab · 8 Rusia · 9 Korea · 10 Portugis.
                  Pisahkan antar bahasa dengan baris kosong (Enter 2x). Bahasa yang dikosongkan akan memakai quote bahasa lain yang terisi. Maks 600 karakter per bahasa.
                </p>

                {entry.quotesText.trim() && (
                  <div className="mt-3 p-3 rounded-xl bg-neutral-950 border border-neutral-800 space-y-1.5">
                    <p className="text-[11px] font-bold text-neutral-300">Pratinjau: {segments.length} paragraf terbaca{segments.length > 10 ? ' — paragraf ke-11 dan seterusnya diabaikan' : ''}</p>
                    {LOCALES.map((loc, i) => (
                      <div key={loc.code} className="flex gap-2 text-[11px] leading-relaxed">
                        <span className="shrink-0 w-24 text-neutral-500">{i + 1}. {loc.label}</span>
                        {segments[i]
                          ? <span className="text-neutral-200 line-clamp-2">{segments[i]}</span>
                          : <span className="text-neutral-600 italic">kosong — memakai bahasa lain</span>}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-300 mb-1.5">Keterangan {idx + 1} (opsional)</label>
                <input value={entry.detail} onChange={(e) => setEntry(idx, { detail: e.target.value })} maxLength={120} placeholder="Mis. jenis peluang atau kota" className="w-full h-11 bg-neutral-950 border border-neutral-800 rounded-xl px-4 text-sm text-white focus:outline-none focus:border-indigo-400" />
              </div>
            </div>
          );
        })}

        <button type="button" onClick={submit} disabled={busy} className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-all cursor-pointer">
          {busy ? 'Menyimpan…' : 'Simpan Semua Testimoni'}
        </button>
        {note && <p className="text-xs text-neutral-300">{note}</p>}
      </div>

      <div className="p-6 rounded-3xl bg-neutral-900/40 border border-neutral-800/80 space-y-3">
        <h3 className="text-sm font-bold text-white">Testimoni Tersimpan ({items.length})</h3>
        {items.length === 0 && <p className="text-xs text-neutral-500">Belum ada testimoni. Section testimoni di website belum tampil.</p>}
        {items.map((item) => (
          <div key={item.id} className="flex items-start gap-3 p-3 rounded-2xl bg-neutral-950 border border-neutral-800">
            {item.photo ? (
              <img src={item.photo} alt={item.name} className="w-11 h-11 rounded-full object-cover shrink-0" />
            ) : (
              <div className="w-11 h-11 rounded-full bg-neutral-800 shrink-0 flex items-center justify-center text-sm font-extrabold text-neutral-300">{item.name.charAt(0)}</div>
            )}
            <div className="flex-1 min-w-0">
              <div className="text-sm font-bold text-white">{item.name}</div>
              {item.detail && <div className="text-[11px] text-neutral-500">{item.detail}</div>}
              <p className="text-xs text-neutral-300 mt-1 leading-relaxed">“{item.quote}”</p>
              <p className="text-[10px] text-neutral-500 mt-1">Bahasa terisi: {item.quotes ? Object.keys(item.quotes).length : 1}/10</p>
            </div>
            <button type="button" onClick={() => remove(item.id)} className="text-[11px] font-bold text-red-400 hover:text-red-300 cursor-pointer shrink-0">Hapus</button>
          </div>
        ))}
      </div>
    </div>
  );
}
