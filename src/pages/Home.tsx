import React, { useEffect, useState, useRef, useMemo, lazy, Suspense } from "react";
import { useLanguage } from "../context/LanguageContext";
import { motion, AnimatePresence, useInView } from "motion/react";
import { ArrowRight, ArrowLeft, ArrowDown, X, MapPin, User, Mail, Phone, Users, Share2, Check, Copy, ShieldCheck, FileText, Quote, Store, TrendingUp, CircleDollarSign, Briefcase, Wrench, Building2, ShoppingBag, LayoutGrid, GraduationCap, Search, HandCoins, Lock, ChevronDown, SearchCheck, Megaphone } from "lucide-react";
import { LanguageSwitcher } from "../components/LanguageSwitcher";
const RotatingGlobe = lazy(() => import("../components/RotatingGlobe").then((m) => ({ default: m.RotatingGlobe })));
import { PartnershipFormModal } from "../components/PartnershipFormModal";
import { CountdownBadge } from "../components/CountdownBadge";
import { getLegalModalData } from "../data/legalModalData";
import { subscribeHeroCounter, getCachedHeroCount, getCachedGroupCount } from "../lib/heroCounterService";
import { subscribeCtaConfig, getCachedCtaEnabled } from "../lib/ctaService";
import { getVideoIdForLocale, subscribeVideoConfig, getCachedVideoConfig, VideoEmbedConfig } from "../lib/videoEmbedService";
import { getCtaShareConfig } from "../lib/ctaShareConfig";
import {
  subscribeWebsiteContent,
  getCachedWebsiteContent,
  WebsiteContentConfig,
  getLocalizedText
} from "../lib/websiteContentService";

// Replace this with your actual YouTube video ID
const YOUTUBE_VIDEO_ID = "usbpo8zE3W4";

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] as const } },
};

const stagger = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

interface SectionProps {
  children: React.ReactNode;
  className?: string;
  key?: React.Key | null;
}

function Section({ children, className = "" }: SectionProps) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div
      ref={ref}
      variants={stagger}
      initial="hidden"
      animate={inView ? "show" : "hidden"}
      className={className}
    >
      {children}
    </motion.div>
  );
}


const problemStagger = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

function ProblemSection({ t, ctaLabel, onOpenForm, isRtl, points }: { t: (key: string) => string; ctaLabel: string; onOpenForm: () => void; isRtl: boolean; points: { icon: React.ComponentType<{ className?: string }>; label: string }[] }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const reduceMotion = useMemo(
    () =>
      typeof window !== "undefined" &&
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    []
  );
  // 2026-11-16: bulatan icon + garis vertikal DIHAPUS atas perintah user
  // ("Hapus garis dan bulatan di section 2") — struktur dua blok tanpa badge column.
  // Judul poin masalah (problem_point_title) juga tidak dirender lagi (kunci tetap
  // dormant di translations.ts untuk restore; alt gambar pas-1 masih memakainya).
  // Isi poin masalah: judul h2 (hero_categories_title) + 8 kotak kategori
  // (kembali ke 8 grup gabungan sejak 2026-11-17 atas perintah user "kategori
  // jadikan 8 kartu"; 10 kategori sesuai Penjelasan Bisnis 2026-11-16 21:37
  // digabung: Pekerjaan & Proyek, Properti & Aset, "Lainnya"),
  // 2 per baris (4 baris), tanpa icon di kotak. problem_section_title
  // ("Mencari partner yang tepat itu tidak mudah") TIDAK dirender — kunci tetap dormant.
  // Revisi GPT 2 (2026-11-15) menggabung Masalah+Solusi jadi satu blok — dibatalkan oleh
  // desain ini (struktur dua blok kembali, isi Masalah = grid kategori).
  // Kunci problem_both_*/problem_solution_divider tetap ada di translations.ts
  // dan pas-1.webp tetap ada di public/ untuk restore.
  // Panah CTA membalik di RTL (Arab)
  const SectionArrow = isRtl ? ArrowLeft : ArrowRight;
  const sectionArrowCls = "w-4 h-4 shrink-0 relative z-10 transition-transform duration-300 " + (isRtl ? "group-hover:-translate-x-1" : "group-hover:translate-x-1");
  // 2026-11-16 20:45 (perintah user "design section 2 samakan seperti section 3"):
  // judul section kini h2 besar TENGAH (seperti judul "Cukup 3 langkah.").
  // 2026-11-16 21:12 (perintah user): judul jadi "Temukan peluang yang Anda cari."
  // + gambar solusi pas-3 dan judul solusi DIHAPUS dari render (file + kunci
  // tetap untuk restore). Urutan isi kini: judul -> 8 kotak kategori -> CTA.
  // Backup pra-desain: backups/section2-sama-section3-2026-11-16/ dan
  // backups/section2-judul-baru-2026-11-16/
  return (
    <section className="relative overflow-hidden py-7 sm:py-10 bg-black">
      <div className="relative z-10 px-5 sm:px-8 max-w-7xl mx-auto">
        <motion.div
          ref={ref}
          variants={problemStagger}
          initial={reduceMotion ? false : "hidden"}
          animate={inView ? "show" : "hidden"}
          className="max-w-5xl mx-auto flex flex-col gap-7"
        >
          {/* Judul section TENGAH (dulu h3 kecil rata kiri di blok masalah) */}
          <motion.div variants={fadeUp} className="relative text-center max-w-3xl mx-auto">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-foreground">
              {t("hero_categories_title")}
            </h2>
          </motion.div>
          {/* Poin MASALAH: 8 KARTU KECIL kategori, 2 per baris (4 baris) — 8 grup gabungan sejak 2026-11-17 atas perintah user ("kategori jadikan 8 kartu, mungkin gabung saja atau ada yg dihapus"); sebelumnya 10 kategori sesuai Penjelasan Bisnis (2026-11-16 21:37); gaya kartu MENIRU section cara kerja (rounded-2xl border bg-white/5) atas perintah user 2026-11-16 22:55 ("buat 10 card kecil nya seperti section setelah nya"); daftar teks biasa 22:43 diganti — kartu ini kartu KONTEN tanpa efek hover/cursor, jadi tidak terlihat bisa diklik; KOTAK ANGKA DIHAPUS 2026-11-17 atas perintah user ("kategori gausah pake nomor"); gambar pas-1 DIHAPUS 2026-11-16 atas perintah user (file tetap di public/ untuk restore) */}
          <motion.div variants={fadeUp} className="relative">
            {/* Isi poin masalah: 8 kartu kecil kategori, 2 per baris */}
            <div>
              <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
                {points.map((point, i) => (
                  <div key={i} className="rounded-2xl border border-white/10 bg-white/5 px-3 py-2.5 sm:px-4 sm:py-3 flex items-center">
                    <p className="text-[13px] sm:text-[15px] font-semibold text-foreground leading-snug">
                      {point.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
          {/* Blok SOLUSI (gambar pas-3 + judul "Kami yang mencocokkan...") DIHAPUS
              dari render 2026-11-16 21:12 atas perintah user ("hapus gambar dan
              teks dibawahnya"); file pas-3.webp tetap di public/ + kunci
              problem_solution_* tetap di translations.ts untuk restore.
              Backup: backups/section2-judul-baru-2026-11-16/ */}
          {/* CTA KEDUA (Section 2, di bawah kartu kategori) DIHAPUS 2026-11-17
              atas perintah user ("Hapus cta kedua"); tombol pill biru + handler
              onOpenForm/ctaLabel tetap di backup untuk restore satu baris.
              Backup: backups/hapus-cta-kedua-2026-11-17/ */}
        </motion.div>
      </div>
    </section>
  );
}


// ── BLOK KEPERCAYAAN (audit Claude 7/10, 2026-11-16: 3 kartu — Identitas Terverifikasi, Kesepakatan Tertulis, Privasi Terjaga; kartu "Didampingi Tim" + "Panduan untuk Pemula" dihapus, isinya pindah ke langkah 3; kunci trust2_4_* dormant) ──
function TrustSection({ t }: { t: (key: string) => string }) {
  const items = [
    { icon: ShieldCheck, title: t("trust2_1_title"), desc: t("trust2_1_desc") },
    { icon: FileText, title: t("trust2_2_title"), desc: t("trust2_2_desc") },
    { icon: Lock, title: t("trust2_3_title"), desc: t("trust2_3_desc") },
  ];
  return (
    <section className="relative overflow-hidden py-8 sm:py-10 bg-background">
      <div className="relative z-10 px-5 sm:px-8 max-w-7xl mx-auto">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-foreground text-center mb-7 sm:mb-9">
            {t("trust2_title")}
          </h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((item, i) => {
              const Icon = item.icon;
              return (
                <div key={i} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2.5 sm:px-5 sm:py-3">
                  <div className="flex items-center justify-center w-10 h-10 rounded-lg shrink-0 mb-2" style={{ background: "hsl(var(--brand-accent)/0.15)" }}>
                    <Icon className="w-5 h-5" style={{ color: "hsl(var(--brand-accent))" }} />
                  </div>
                  <h3 className="text-[15px] sm:text-base font-bold text-foreground leading-snug">{item.title}</h3>
                  <p className="text-[13.5px] sm:text-sm text-foreground/70 leading-relaxed mt-1">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}


// ── BIAYA & KETENTUAN (revisi GPT 7.2, 2026-11-16 — transparansi biaya + bagi hasil) ──
function BiayaSection({ t }: { t: (key: string) => string }) {
  return (
    <section className="relative overflow-hidden py-10 sm:py-14 bg-background">
      <div className="relative z-10 px-5 sm:px-8 max-w-7xl mx-auto">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-foreground text-center mb-7 sm:mb-9">
            {t("biaya_title")}
          </h2>
          <p className="text-[15.5px] sm:text-[16px] text-foreground/70 leading-relaxed">{t("biaya_p2")}</p>
        </div>
      </div>
    </section>
  );
}

// ── HARGA GRATIS vs PRO (2026-11-15, audit eksternal) ──
function PricingSection({ t, locale, onOpenForm }: { t: (key: string) => string; locale: string; onOpenForm: () => void }) {
  const proPrice: Record<string, string> = {
    "id-ID": "Rp10.000", "en-US": "$1", "es-ES": "1 €", "fr-FR": "1 €", "ja-JP": "100円",
    "zh-CN": "5元", "ar-SA": "5 ر.س", "ko-KR": "₩1,000", "pt-PT": "1 €", "ru-RU": "100 ₽",
  };
  const tiers = [
    {
      name: "STANDARD",
      price: t("pricing_card_free"),
      tagline: t("pricing_free_tagline"),
      features: t("pricing_free_features").split("\n"),
      cta: t("pricing_free_cta"),
      featured: false,
    },
    {
      name: "PRO",
      price: proPrice[locale] || "Rp10.000",
      tagline: t("pricing_pro_tagline"),
      features: t("pricing_pro_features").split("\n"),
      cta: t("pricing_pro_cta"),
      featured: true,
    },
  ];
  return (
    <section className="relative overflow-hidden py-8 sm:py-10 bg-background">
      <div className="relative z-10 px-5 sm:px-8 max-w-7xl mx-auto">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-foreground text-center mb-5 sm:mb-6">
            {t("pricing_title")}
          </h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {tiers.map((tier) => (
              <div
                key={tier.name}
                className={`rounded-2xl border p-4 sm:p-5 flex flex-col ${tier.featured ? "border-[hsl(var(--brand-accent))] bg-[hsl(var(--brand-accent)/0.08)]" : "border-white/10 bg-white/5"}`}
              >
                <div className="text-sm font-bold tracking-widest text-foreground/60">{tier.name}</div>
                <div className="mt-2 text-2xl sm:text-3xl font-black tracking-tight text-foreground">{tier.price}</div>
                <div className="mt-1 text-sm text-foreground/60">{tier.tagline}</div>
                <ul className="mt-4 flex flex-col gap-2 flex-1">
                  {tier.features.map((f, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-[14.5px] sm:text-[15px] text-foreground/85 leading-snug">
                      <Check className="w-4 h-4 mt-0.5 shrink-0" style={{ color: "hsl(var(--brand-accent))" }} />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
                <button
                  type="button"
                  onClick={onOpenForm}
                  className={`mt-5 w-full h-11 rounded-full font-black text-sm sm:text-base transition-all duration-300 cursor-pointer ${tier.featured ? "text-neutral-950 border border-white/20" : "text-foreground border border-white/20 bg-white/5 hover:bg-white/10"}`}
                  style={tier.featured ? { background: "hsl(var(--brand-accent))" } : undefined}
                >
                  {tier.cta}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ── FAQ (terbuka semua, tanpa dropdown — dikembalikan 2026-11-15) ──
function FaqSection({ t }: { t: (key: string) => string }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const items = [
    { q: t("faq_q1"), a: t("faq_a1") },
    { q: t("faq_q2"), a: t("faq_a2") },
    { q: t("faq_q3"), a: t("faq_a3") },
    { q: t("faq_q4"), a: t("faq_a4") },
    { q: t("faq_q5"), a: t("faq_a5") },
  ];
  // FAQ 5 pertanyaan, accordion tertutup semua (Q6 privasi DORMANT sejak
  // 2026-11-17 — isinya sudah tercakup kartu trust 3 "Privasi Terjaga";
  // tambah item { q: t("faq_q6"), a: t("faq_a6") } untuk mengembalikan)
  return (
    <section className="relative overflow-hidden py-10 sm:py-14 bg-background">
      <div className="relative z-10 px-5 sm:px-8 max-w-7xl mx-auto">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-foreground text-center mb-7 sm:mb-9">
            {t("faq_title")}
          </h2>
          <div className="flex flex-col gap-3">
            {items.map((item, i) => {
              const open = openIndex === i;
              return (
                <div key={i} className="rounded-2xl border border-white/10 bg-white/5 overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setOpenIndex(open ? null : i)}
                    aria-expanded={open}
                    className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left cursor-pointer"
                  >
                    <span className="text-[15.5px] sm:text-base font-semibold text-foreground">{item.q}</span>
                    <ChevronDown className={`w-5 h-5 shrink-0 text-foreground/60 transition-transform duration-300 ${open ? "rotate-180" : ""}`} />
                  </button>
                  {open && (
                    <p className="px-5 pb-4 text-[14.5px] sm:text-[15px] text-foreground/70 leading-relaxed whitespace-pre-line">{item.a}</p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

// Helper to format number according to locale
const formatNumberByLocale = (num: number, loc: string): string => {
  const lang = loc.split("-")[0];
  if (lang === "id" || lang === "de" || lang === "es" || lang === "pt" || lang === "tr") {
    return num.toLocaleString("de-DE");
  }
  if (lang === "fr" || lang === "ru") {
    return num.toLocaleString("fr-FR");
  }
  return num.toLocaleString("en-US");
};


// Pemutar video hero: FACADE dengan tombol play BIRU (2026-11-17, perintah user
// "tombol play ganti biru") — thumbnail YouTube + tombol play brand-accent
// (biru yang sama seperti tombol Daftar). Thumbnail di sini adalah thumbnail
// YouTube video tsb (per locale, via i.ytimg.com); mengganti GAMBAR
// thumbnail-nya sendiri adalah pekerjaan YouTube Studio, bukan situs.
// Sebelumnya (s.d. 2026-11-17): embed YouTube original langsung (iframe),
// tombol play merah bawaan YouTube yang tidak bisa diubah dari situs.
//
// PEMANASAN PLAYER (2026-11-17, keluhan user "dari klik ke play lama sekali"):
// iframe YouTube dimuat TERSEMBUNYI di latar belakang 1,5 detik setelah halaman
// tampil, jadi saat tombol play diklik player-nya sudah siap dan video langsung
// jalan via perintah playVideo (postMessage, enablejsapi=1) — bukan menunggu
// player dimuat dari nol. Kalau tombol diklik SEBELUM pemanasan selesai,
// iframe langsung dimuat dengan autoplay=1 (jalur lambat lama, hanya di
// 1,5 detik pertama).
function HeroVideoPlayer({ videoId, title }: { videoId: string; title: string }) {
  const [playing, setPlaying] = useState(false);
  const [warmed, setWarmed] = useState(false);
  const [autoplayOnMount, setAutoplayOnMount] = useState(false);
  const [quality, setQuality] = useState(0);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const warmedRef = useRef(false);
  const posters = ["maxresdefault", "sddefault", "hqdefault"];
  // Ganti bahasa = video lain: kembali ke cover (poster + tombol play).
  useEffect(() => {
    setPlaying(false);
    setQuality(0);
    setWarmed(false);
    setAutoplayOnMount(false);
    warmedRef.current = false;
  }, [videoId]);
  // Panaskan player di latar belakang (tertunda 1,5 dtk agar tidak berebut
  // dengan muatan awal halaman).
  useEffect(() => {
    const t = setTimeout(() => { warmedRef.current = true; setWarmed(true); }, 1500);
    return () => clearTimeout(t);
  }, [videoId]);
  const play = () => {
    if (!warmedRef.current) {
      warmedRef.current = true;
      setAutoplayOnMount(true);
      setWarmed(true);
    }
    setPlaying(true);
    const sendPlay = () => {
      try {
        iframeRef.current?.contentWindow?.postMessage(
          JSON.stringify({ event: "command", func: "playVideo", args: "" }),
          "*"
        );
      } catch { /* iframe belum ada — autoplay yang menangani */ }
    };
    sendPlay();
    // Ulangi 2x untuk jaga-jaga player belum siap saat perintah pertama dikirim.
    setTimeout(sendPlay, 600);
    setTimeout(sendPlay, 1500);
  };
  return (
    <div className="absolute inset-0 w-full h-full">
      {warmed && (
        <iframe
          ref={iframeRef}
          src={`https://www.youtube.com/embed/${videoId}?rel=0&enablejsapi=1&origin=${encodeURIComponent(window.location.origin)}${autoplayOnMount ? "&autoplay=1" : ""}`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          className={`absolute inset-0 w-full h-full border-0 ${playing ? "" : "invisible"}`}
        />
      )}
      {!playing && (
        <button
          type="button"
          onClick={play}
          aria-label={title}
          className="absolute inset-0 w-full h-full group cursor-pointer border-0 p-0 bg-black"
        >
          <img
            src={`https://i.ytimg.com/vi/${videoId}/${posters[quality]}.jpg`}
            onError={() => { if (quality < posters.length - 1) setQuality(quality + 1); }}
            alt={title}
            className="absolute inset-0 w-full h-full object-cover"
          />
          {/* Tombol play BIRU (brand accent, sama seperti tombol Daftar) */}
          <span className="absolute inset-0 flex items-center justify-center">
            <span
              className="flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-full shadow-[0_8px_30px_rgba(0,0,0,0.45)] transition-transform duration-300 group-hover:scale-110"
              style={{ background: "hsl(var(--brand-accent))" }}
            >
              <svg viewBox="0 0 24 24" className="w-7 h-7 sm:w-8 sm:h-8 translate-x-[2px] fill-white" aria-hidden="true">
                <path d="M8 5.5v13l11-6.5z" />
              </svg>
            </span>
          </span>
        </button>
      )}
    </div>
  );
}

export default function Home() {
  const { t, locale } = useLanguage();
  const [scrolled, setScrolled] = useState(false);
  const [activeModal, setActiveModal] = useState<null | 'about' | 'contact' | 'share' | 'terms' | 'privacy'>(null);
  const [shareCopied, setShareCopied] = useState(false);
  const [isPartnershipModalOpen, setIsPartnershipModalOpen] = useState(false);
  const [testimonials, setTestimonials] = useState<Array<{ id: number; name: string; quote: string; quotes?: Record<string, string> | null; photo: string | null; detail: string | null }>>([]);

  // Testimonials managed from the admin panel (shown above the CTA).
  useEffect(() => {
    fetch("/api/testimonials")
      .then((r) => r.json())
      .then((d) => { if (Array.isArray(d?.data)) setTestimonials(d.data); })
      .catch(() => {});
  }, []);
    const [memberCount, setMemberCount] = useState<number>(getCachedHeroCount);
  const [groupCount, setGroupCount] = useState<number>(getCachedGroupCount);
  const [ctaEnabled, setCtaEnabled] = useState<boolean>(getCachedCtaEnabled);
  const [videoConfig, setVideoConfig] = useState<VideoEmbedConfig>(getCachedVideoConfig);
  const [contentConfig, setContentConfig] = useState<WebsiteContentConfig>(getCachedWebsiteContent);

  const shareConfig = useMemo(() => getCtaShareConfig(locale), [locale]);



  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => document.removeEventListener("scroll", handleScroll);
  }, []);

  // Real-time synchronized website content (video, images, text) from Cloudflare
  useEffect(() => {
    const unsubscribe = subscribeWebsiteContent((config) => {
      setContentConfig(config);
    });
    return () => unsubscribe();
  }, []);

  // Real-time synchronized CTA visibility settings from Cloudflare
  useEffect(() => {
    const unsubscribe = subscribeCtaConfig((config) => {
      setCtaEnabled(config.enabled);
    });
    return () => unsubscribe();
  }, []);

  // Real-time synchronized Video Embed visibility settings from Cloudflare
  useEffect(() => {
    const unsubscribe = subscribeVideoConfig((config) => {
      setVideoConfig(config);
    });
    return () => unsubscribe();
  }, []);

  // Real-time synchronized live counter from Cloudflare (shared across all visitors)
  useEffect(() => {
    const unsubscribe = subscribeHeroCounter((config) => {
      if (config) {
        if (typeof config.currentCount === "number") {
          setMemberCount(config.currentCount);
        }
        if (typeof config.groupCount === "number") {
          setGroupCount(config.groupCount);
        }
      }
    });
    return () => unsubscribe();
  }, []);

  const legalData = useMemo(() => getLegalModalData(locale), [locale]);
  const navLinks = useMemo(() => [
    { href: "#features", label: t("nav_features") },
  ], [t]);

  // Video ID priority: per-language video (videoConfig.perLocale) > videoConfig global > contentConfig
  const isVideoEnabled = contentConfig.videoEnabled !== undefined ? contentConfig.videoEnabled : videoConfig.enabled;
  const activeVideoId = getVideoIdForLocale(videoConfig, locale) || contentConfig.youtubeVideoId || YOUTUBE_VIDEO_ID;
  const heroGifSrc = videoConfig.gifPerLocale?.[locale] || videoConfig.gifUrl || videoConfig.gifData || "";
  // Show the lightweight poster again whenever the per-language video changes.

  // Custom headline or localized default (line 1; line 2 is a separate key)
  const headline = getLocalizedText(contentConfig, locale, 'heroHeadline', t("hero_headline_1"));
  const headlineParts = useMemo(() => {
    return headline.split(/(\{count\}|\{groups\})/g);
  }, [headline]);

  const ctaButtonLabel = useMemo(() => {
    if (contentConfig.ctaButtonText && contentConfig.ctaButtonText.trim()) {
      return contentConfig.ctaButtonText;
    }
    const map: Record<string, string> = {
      "id-ID": "Daftar Gratis",
      "en-US": "Register Free",
      "es-ES": "Regístrese Gratis",
      "fr-FR": "Inscrivez-vous Gratuitement",
      "ja-JP": "無料で登録",
      "ar-SA": "سجّل مجاناً",
      "ko-KR": "무료 등록",
      "pt-PT": "Registe-se Grátis",
      "zh-CN": "免费注册",
      "ru-RU": "Зарегистрируйтесь бесплатно",
    };
    return map[locale] || "Daftar Gratis";
  }, [contentConfig.ctaButtonText, locale]);

  // Panah CTA membalik di RTL (Arab) — 2026-11-15
  const ArrowIcon = locale === "ar-SA" ? ArrowLeft : ArrowRight;
  const arrowIconCls = "w-4 h-4 shrink-0 relative z-10 transition-transform duration-300 " + (locale === "ar-SA" ? "group-hover:-translate-x-1" : "group-hover:translate-x-1");

  const opportunityTypes = useMemo(() => {
    // 8 GRUP GABUNGAN (kembali ke 8 sejak 2026-11-17, perintah user "kategori
    // jadikan 8 kartu, mungkin gabung saja atau ada yg dihapus") — gabungan:
    // Pekerjaan & Proyek; Properti & Aset; "Kolaborasi Lainnya" -> "Lainnya".
    // Label 8 grup ini SAMA dengan versi sebelum 10 kategori (2026-11-16
    // 21:37). Doc Penjelasan Bisnis tetap 10 — halaman menampilkan 8 gabungan.
    // Backup 10 kategori: backups/faq-terms-gambar-hero-2026-11-17/
    const labels: Record<string, string[]> = {
      "id-ID": ["Bisnis & Kemitraan", "Investasi & Pendanaan", "Pekerjaan & Proyek", "Jasa & Keahlian", "Perdagangan", "Properti & Aset", "Pendidikan & Mentoring", "Lainnya"],
      "en-US": ["Business & Partnership", "Investment & Funding", "Jobs & Projects", "Services & Skills", "Trade", "Property & Assets", "Education & Mentoring", "Other"],
      "es-ES": ["Negocios y Alianzas", "Inversión y Financiación", "Empleo y Proyectos", "Servicios y Habilidades", "Comercio", "Inmuebles y Activos", "Educación y Mentoría", "Otros"],
      "fr-FR": ["Affaires et Partenariats", "Investissement et Financement", "Emploi et Projets", "Services et Compétences", "Commerce", "Immobilier et Actifs", "Éducation et Mentorat", "Autres"],
      "ja-JP": ["ビジネスと提携", "投資と資金調達", "仕事とプロジェクト", "サービスとスキル", "貿易", "不動産と資産", "教育とメンター", "その他"],
      "ar-SA": ["أعمال وشراكات", "استثمار وتمويل", "وظائف ومشاريع", "خدمات ومهارات", "تجارة", "عقارات وأصول", "تعليم وإرشاد", "أخرى"],
      "ko-KR": ["비즈니스 및 파트너십", "투자 및 자금 조달", "일자리 및 프로젝트", "서비스 및 기술", "무역", "부동산 및 자산", "교육 및 멘토링", "기타"],
      "pt-PT": ["Negócios e Parcerias", "Investimento e Financiamento", "Empregos e Projetos", "Serviços e Competências", "Comércio", "Imobiliário e Ativos", "Educação e Mentoria", "Outros"],
      "zh-CN": ["商业与合作", "投资与融资", "工作与项目", "服务与技能", "贸易", "房地产与资产", "教育与辅导", "其他"],
      "ru-RU": ["Бизнес и партнёрство", "Инвестиции и финансирование", "Работа и проекты", "Услуги и навыки", "Торговля", "Недвижимость и активы", "Образование и наставничество", "Другое"],
    };
    // Ikon tidak dirender di kotak (hanya label) — dipakai agar map points lengkap 8.
    const icons = [Store, TrendingUp, Briefcase, Wrench, ShoppingBag, Building2, GraduationCap, LayoutGrid];
    const names = labels[locale] || labels["id-ID"];
    return icons.map((icon, i) => ({ icon, label: names[i] }));
  }, [locale]);

  // Gambar langkah adalah FILE STATIS (public/step-images/) — bukan dari D1.
  // Alasan (2026-11-16): rantai D1 (polling /api/settings + /api/img/ +
  // localStorage) terbukti rapuh di HP user — gambar "muncul lalu hilang"
  // walau server dan semua pengecekan headless baik-baik saja. File statis
  // dimuat lewat jalur yang sama seperti logo dan gambar Section 2.
  // Nilai D1 feature*Image tetap ada (panel admin + /api/img/ tetap jalan)
  // tapi tidak lagi dipakai untuk render publik.
  // Sejak 2026-11-16 20:37 (perintah user "biar ringkas"): section langkah
  // memakai SATU gambar (steps-satu.webp, di atas grid langkah) — 3 gambar
  // per-langkah tidak lagi dirender. File step1-*.webp/step2/step3 tetap
  // ada di public/step-images/ untuk restore. Ganti gambar = ganti file
  // di public/step-images/ lalu deploy.
  const FEATURES = useMemo(() => {
    return [
    {
      title: getLocalizedText(contentConfig, locale, 'feature1Title', t("feature_1_title")),
      desc: getLocalizedText(contentConfig, locale, 'feature1Desc', t("feature_1_desc")),
      alt: getLocalizedText(contentConfig, locale, 'feature1Title', "Mulai Bersama"),
    },
    {
      title: getLocalizedText(contentConfig, locale, 'feature2Title', t("feature_2_title")),
      desc: getLocalizedText(contentConfig, locale, 'feature2Desc', t("feature_2_desc")),
      alt: getLocalizedText(contentConfig, locale, 'feature2Title', "Temukan & Gabung Peluang"),
    },
    {
      title: getLocalizedText(contentConfig, locale, 'feature3Title', t("feature_3_title")),
      desc: getLocalizedText(contentConfig, locale, 'feature3Desc', t("feature_3_desc")),
      alt: getLocalizedText(contentConfig, locale, 'feature3Title', "Belajar dan Berkembang"),
    },
    ];
  }, [t, locale, contentConfig]);

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden selection:bg-[hsl(var(--brand-accent)/0.3)]">

      {/* ── NAVBAR (always LTR: logo left, language switcher right, even in Arabic) ── */}
      <header
        dir="ltr"
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? "bg-background/90 backdrop-blur-xl" : "bg-transparent"
        }`}
      >
        <div className="container mx-auto px-5 sm:px-8 h-16 flex items-center justify-between">
          {/* Logo */}
          <a href="#" className="flex items-center shrink-0">
            <img src="/logo-partnerfind.webp" alt="PartnerFind" className="h-5 sm:h-6 w-auto" />
          </a>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-6 text-[13.5px] font-medium text-foreground/80">
            {navLinks.map((link) => (
              <a key={link.href} href={link.href} className="hover:text-foreground transition-colors py-1">
                {link.label}
              </a>
            ))}
          </nav>

          {/* Desktop right — language selector */}
          <div className="hidden md:flex items-center">
            <LanguageSwitcher variant="desktop" />
          </div>

          {/* Mobile right — language selector */}
          <div className="flex md:hidden items-center">
            <LanguageSwitcher variant="desktop" />
          </div>
        </div>
      </header>

      {/* ── HERO ── */}
      <section
        className={`relative overflow-hidden transition-all duration-300 ${
          isVideoEnabled
            ? "pt-28 sm:pt-32 pb-4"
            : "pt-32 sm:pt-36 md:pt-40 pb-4 sm:pb-6"
        }`}
      >
        {/* Background glow */}
        <div
          className={`absolute ${isVideoEnabled ? "top-[30%]" : "top-[25%] sm:top-[28%]"} left-1/2 -translate-x-1/2 -translate-y-1/2 w-[min(700px,90vw)] aspect-square rounded-full pointer-events-none transition-all duration-500`}
          style={{ background: "radial-gradient(circle, hsl(var(--brand-accent)/0.18) 0%, transparent 70%)", filter: "blur(60px)" }}
        />
        <div
          className="absolute bottom-0 right-[-10%] w-[min(500px,70vw)] aspect-square rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, hsl(var(--brand-accent)/0.07) 0%, transparent 70%)", filter: "blur(80px)" }}
        />

        <div className="container mx-auto px-5 sm:px-8 relative z-10">
          <motion.div
            variants={stagger}
            initial="hidden"
            animate="show"
            className="max-w-5xl mx-auto text-center"
          >
            {/* Label "Pendaftaran awal dibuka" DIHAPUS 2026-11-16 atas perintah user (render dihapus; hero_badge_label tetap ada di translations.ts untuk restore) */}
            <motion.h1
              variants={fadeUp}
              className={`max-w-4xl mx-auto text-[clamp(2rem,7vw,3.9rem)] font-black tracking-tight leading-[1.15] ${
                isVideoEnabled ? "mb-6 sm:mb-8" : "mb-8 sm:mb-10 md:mb-12"
              } whitespace-pre-line text-foreground transition-all duration-300`}
            >
              {/* H1 mengalir MENYAMBUNG (2026-11-17, perintah user "setelah titik
                  langsung lanjutkan"): kedua span inline, baris 2 diawali spasi
                  — dulu keduanya block (dua paragraf terpisah). */}
              <span className="inline">
                {headlineParts.map((part, idx) => {
                  if (part === "{count}") {
                    return (
                      <span key={`member-${idx}`} className="relative overflow-hidden inline-flex items-baseline align-baseline mx-0.5">
                        <AnimatePresence mode="popLayout" initial={false}>
                          <motion.span
                            key={memberCount}
                            initial={{ y: "50%", opacity: 0, scale: 0.96 }}
                            animate={{ y: "0%", opacity: 1, scale: 1 }}
                            exit={{ y: "-50%", opacity: 0, scale: 0.96 }}
                            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] as const }}
                            className="inline-block text-foreground font-black tracking-tight"
                          >
                            {formatNumberByLocale(memberCount, locale)}
                          </motion.span>
                        </AnimatePresence>
                      </span>
                    );
                  }
                  if (part === "{groups}") {
                    return (
                      <span key={`group-${idx}`} className="relative overflow-hidden inline-flex items-baseline align-baseline mx-0.5">
                        <AnimatePresence mode="popLayout" initial={false}>
                          <motion.span
                            key={groupCount}
                            initial={{ y: "50%", opacity: 0, scale: 0.96 }}
                            animate={{ y: "0%", opacity: 1, scale: 1 }}
                            exit={{ y: "-50%", opacity: 0, scale: 0.96 }}
                            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] as const }}
                            className="inline-block text-foreground font-black tracking-tight"
                          >
                            {formatNumberByLocale(groupCount, locale)}
                          </motion.span>
                        </AnimatePresence>
                      </span>
                    );
                  }
                  return <React.Fragment key={idx}>{part}</React.Fragment>;
                })}
              </span>
              {/* Baris 2 H1 hanya dirender bila tidak kosong; inline + spasi di depan
                  supaya menyambung langsung setelah titik baris 1 */}
              {t("hero_headline_2").trim() !== "" && (
                <span className="inline text-white">{" "}{t("hero_headline_2")}</span>
              )}
            </motion.h1>

            {/* Subheadline — DIPULIHKAN 2026-11-16 21:18 (copy hero baru dari user;
                sempat dihapus ~17:46 saat headline panjang Opsi 2 menggantikannya) */}
            <motion.p variants={fadeUp} className="max-w-2xl mx-auto text-[15.5px] sm:text-lg text-foreground/70 leading-relaxed mb-6 sm:mb-8">
              {t("hero_subheadline")}
            </motion.p>

            {/* ── TOMBOL DAFTAR HERO (LEBIH PANJANG DENGAN ROUNDED-FULL & MAGNETIK) ── */}
            <motion.div variants={fadeUp} className="w-full max-w-sm mx-auto mb-6 sm:mb-8 px-4 sm:px-0">
              <div className="relative group w-full">
                {/* Subtle Refined Halo Glow */}
                <div
                  aria-hidden="true"
                  className="absolute -inset-0.5 rounded-full blur-sm opacity-30 group-hover:opacity-45 transition-opacity duration-300 pointer-events-none"
                  style={{
                    background: "hsl(var(--brand-accent))",
                  }}
                />

                {/* Primary Button */}
                <button
                  type="button"
                  onClick={() => setIsPartnershipModalOpen(true)}
                  className="relative w-full h-12 px-6 rounded-full font-black text-sm sm:text-base text-neutral-950 transition-all duration-300 cursor-pointer overflow-hidden shadow-[0_2px_10px_hsl(var(--brand-accent)/0.25)] hover:shadow-[0_4px_16px_hsl(var(--brand-accent)/0.35)] hover:scale-[1.02] active:scale-[0.98] border border-white/20 flex items-center justify-center gap-2.5"
                  style={{ background: "hsl(var(--brand-accent))" }}
                >
                  {/* Top specular reflection */}
                  <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/80 to-transparent pointer-events-none" />

                  {/* Kilatan cahaya menyapu berkala (Periodic Light Flash) */}
                  <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/50 to-transparent pointer-events-none animate-btn-flash" />

                  {/* Kilatan cahaya ekstra saat kursor mengarah (Hover Flash) */}
                  <div className="absolute -inset-full w-[200%] h-full bg-gradient-to-r from-transparent via-white/40 to-transparent -skew-x-12 group-hover:translate-x-full transition-transform duration-1000 ease-out pointer-events-none" />

                  {/* Button text */}
                  <span className="relative z-10 font-black tracking-tight whitespace-nowrap">
                    {ctaButtonLabel}
                  </span>

                  {/* Arrow icon with hover forward slide */}
                  <ArrowIcon className={arrowIconCls} />
                </button>
              </div>
              {/* Micro-copy tepat di bawah tombol CTA */}
              <p className="mt-3 text-center text-xs sm:text-sm text-foreground/60">
                {t("hero_cta_microcopy")}
              </p>
            </motion.div>

            {/* Kategori dipindah ke Section 2 sebagai poin masalah (2026-11-16, atas perintah user) — kunci hero_categories_title kini jadi judul poin masalah di Section 2 */}

            {/* ── FLAGSHIP VIDEO SHOWCASE (Dapat diaktifkan/dinonaktifkan via Admin) ── */}
            {isVideoEnabled && (
              <motion.div variants={fadeUp} className="w-full max-w-5xl mx-auto mb-4 sm:mb-6 relative">
                {/* Soft, subtle atmospheric ambient light */}
                <div
                  className="pointer-events-none absolute -inset-4 sm:-inset-8 rounded-2xl sm:rounded-3xl opacity-30 blur-3xl transition-opacity duration-700 -z-10"
                  style={{
                    background:
                      "radial-gradient(ellipse 70% 60% at 50% 50%, hsl(var(--brand-accent) / 0.45) 0%, transparent 70%)",
                  }}
                />

                {/* Modern Minimalist Video Embed (Enlarged with smooth rounded corners) */}
                <div className="relative w-full rounded-2xl sm:rounded-3xl overflow-hidden bg-neutral-950 border border-neutral-800 shadow-[0_30px_70px_-15px_rgba(0,0,0,0.95)]">
                  {/* Sleek top specular highlight */}
                  <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none z-10" />

                  <div
                    className="relative w-full bg-black"
                    style={{ paddingBottom: "56.25%" }}
                  >
                    {heroGifSrc ? (
                      <img
                        className="absolute inset-0 w-full h-full object-cover"
                        src={heroGifSrc}
                        alt={contentConfig.videoTitle || "PartnerFind"}
                      />
                    ) : videoConfig.mp4Url ? (
                      <video
                        className="absolute inset-0 w-full h-full object-cover"
                        src={videoConfig.mp4Url}
                        poster={videoConfig.mp4Poster || undefined}
                        autoPlay
                        muted
                        loop
                        playsInline
                      />
                    ) : (
                      <HeroVideoPlayer videoId={activeVideoId} title={contentConfig.videoTitle || "PartnerFind Platform Overview"} />
                    )}
                  </div>
                </div>
              </motion.div>
            )}


          </motion.div>
        </div>
      </section>

      <ProblemSection t={t} ctaLabel={ctaButtonLabel} onOpenForm={() => setIsPartnershipModalOpen(true)} isRtl={locale === "ar-SA"} points={opportunityTypes} />

      {/* ── FEATURES / SECTION 3 LANGKAH (3 langkah KARTU seperti section 4 Trust — tanpa garis, tanpa gambar sejak 2026-11-17) ── */}
      <section
        id="features"
        className={`relative overflow-hidden transition-all duration-300 ${
          !ctaEnabled
            ? "pt-4 sm:pt-6 pb-9 sm:pb-12 lg:pb-16"
            : "pt-4 sm:pt-6 pb-8 sm:pb-9"
        }`}
      >
        <div
          className="absolute right-[-5%] top-1/2 -translate-y-1/2 w-[min(400px,60vw)] aspect-square rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, hsl(var(--brand-accent)/0.08) 0%, transparent 70%)", filter: "blur(80px)" }}
        />
        {/* 2026-11-16 20:56 (perintah user "centre kan"): wrapper steps kini
            simetris px-5 sm:px-8 seperti semua section lain — wrapper asimetris
            (ps-2 sm:ps-4) dari restore ~15:52 diganti. Backup:
            backups/section3-centre-2026-11-16/ */}
        <div className="relative z-10 px-5 sm:px-8 max-w-7xl mx-auto">
          <Section className="mb-7 sm:mb-9 text-center max-w-3xl mx-auto">
            <motion.h2 variants={fadeUp} className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-foreground">
              {getLocalizedText(contentConfig, locale, 'featuresLabel', t("features_label"))}
            </motion.h2>
          </Section>

          {/* Gambar section langkah DIHAPUS LAGI dari render 2026-11-17 atas
              perintah user ("faq dan gambar hapus deh, terlalu panjang
              halamannya"); sempat DIKEMBALIKAN di hari yang sama. File
              steps-satu-v2.webp tetap di public/step-images/ untuk restore.
              Riwayat: satu gambar sejak 20:37 2026-11-16 ("biar ringkas"),
              v2 sejak 20:59 (ikon profil -> centang -> jabat tangan), dihapus
              21:23, dikembalikan + dihapus lagi 2026-11-17. Backup versi
              bergambar: backups/faq-gambar-hapus-2026-11-17/ */}

          {/* 3 langkah sebagai KARTU seperti section 4 Trust (2026-11-16 20:51,
              perintah user "samakan section 4, gak lagi pake garis"): kolom badge
              + garis penghubung vertikal/horizontal DIHAPUS; angka langkah kini
              di dalam kotak ikon kartu. */}
          <Section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((item, i) => (
              <motion.div key={i} variants={fadeUp} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2.5 sm:px-5 sm:py-3">
                <div className="flex items-center justify-center w-10 h-10 rounded-lg shrink-0 mb-2" style={{ background: "hsl(var(--brand-accent)/0.15)" }}>
                  <span className="font-black text-lg leading-none" style={{ color: "hsl(var(--brand-accent))" }}>{i + 1}</span>
                </div>
                <h3 className="text-[15px] sm:text-base font-bold text-foreground leading-snug">
                  {item.title}
                </h3>
                <p className="text-[13.5px] sm:text-sm text-foreground/70 leading-relaxed mt-1">
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </Section>

          {/* Transisi halus ketika CTA disembunyikan */}
          {!ctaEnabled && (
            <div className="mt-9 sm:mt-11 flex justify-center">
              <div
                className="w-36 sm:w-52 h-[1px] opacity-30 rounded-full"
                style={{
                  background:
                    "linear-gradient(90deg, transparent, hsl(var(--brand-accent)), transparent)",
                }}
              />
            </div>
          )}
        </div>
      </section>

      {/* ── TESTIMONIALS (di atas CTA; hanya tampil bila ada testimoni asli) ── */}
      {testimonials.length > 0 && (
        <section className="py-12 sm:py-16 bg-background relative z-10 overflow-hidden">
          <div className="container mx-auto px-5 sm:px-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-foreground">
              {{
                "id-ID": "Apa Kata Mereka",
                "en-US": "What They Say",
                "es-ES": "Lo que dicen",
                "fr-FR": "Ce qu'ils disent",
                "ja-JP": "利用者の声",
                "ar-SA": "ماذا يقولون",
                "ko-KR": "이용자 후기",
                "pt-PT": "O que dizem",
                "zh-CN": "用户评价",
                "ru-RU": "Что говорят",
              }[locale] || "Apa Kata Mereka"}
              </h2>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
              {testimonials.map((item) => (
                <figure
                  key={item.id}
                  className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 flex flex-col gap-4 transition-colors duration-300 hover:border-white/20"
                >
                  <Quote
                    className="w-5 h-5 shrink-0"
                    style={{ color: "hsl(var(--brand-accent))" }}
                    fill="currentColor"
                  />
                  <blockquote className="text-[15px] leading-relaxed text-foreground/85 flex-1">
                    {item.quotes?.[locale] || item.quotes?.["id-ID"] || item.quote}
                  </blockquote>
                  <figcaption className="flex items-center gap-3 border-t border-white/5 pt-4">
                    {item.photo ? (
                      <img
                        src={item.photo}
                        alt={item.name}
                        className="w-10 h-10 rounded-full object-cover border border-white/15 shrink-0"
                        loading="lazy"
                      />
                    ) : (
                      <div
                        className="w-10 h-10 rounded-full shrink-0 flex items-center justify-center text-sm font-bold"
                        style={{
                          background: "hsl(var(--brand-accent) / 0.15)",
                          color: "hsl(var(--brand-accent))",
                        }}
                      >
                        {item.name.charAt(0)}
                      </div>
                    )}
                    <div className="min-w-0">
                      <div className="font-semibold text-sm text-foreground truncate">{item.name}</div>
                      {item.detail && (
                        <div className="text-xs text-foreground/50 truncate">{item.detail}</div>
                      )}
                    </div>
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── KEPERCAYAAN (2026-11-15, audit eksternal — dipertahankan saat revert) ── */}
      <TrustSection t={t} />

      {/* BiayaSection dihapus 2026-11-16 atas perintah user (satu-satunya teksnya dihapus) — komponen + keys tetap ada, satu baris untuk mengembalikan */}

      {/* ── PRICING SECTION — desain standar dua kartu (Standard vs Pro), dikembalikan 2026-11-17 atas perintah user ("ganti design pricing seperti pricing pada umumnya"); kartu tunggal 2026-11-16 diganti (kode + pricing_card_* keys tetap ada di backup/keys untuk restore). Tetap di dalam wrapper ctaEnabled supaya tampil/sembunyi bersama CTA penutup. FaqSection tetap TIDAK dirender (dihapus 2026-11-17, "terlalu panjang"); satu baris untuk mengembalikan: <FaqSection t={t} /> setelah section Pricing. */}
      {ctaEnabled && (
        <PricingSection t={t} locale={locale} onOpenForm={() => setIsPartnershipModalOpen(true)} />
      )}

      {/* ── MINIMALIST CTA SECTION (Dapat diaktifkan/dinonaktifkan via Admin) ── */}
      {ctaEnabled && (
        <section className="py-14 sm:py-16 bg-background relative z-10 text-center overflow-hidden">
          {/* Cahaya ambient warna aksen bahasa */}
          <div
            aria-hidden="true"
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[460px] sm:w-[580px] h-[260px] sm:h-[320px] rounded-full pointer-events-none opacity-30 blur-3xl -z-10 transition-all duration-700"
            style={{
              background: "radial-gradient(circle, hsl(var(--brand-accent)) 0%, transparent 70%)",
            }}
          />

          <div className="container mx-auto px-5 sm:px-8">
            <Section className="max-w-2xl mx-auto flex flex-col items-center">
              <motion.h2
                variants={fadeUp}
                className="text-2xl sm:text-3xl md:text-4xl text-foreground font-bold tracking-tight leading-snug mb-3 max-w-2xl mx-auto text-center"
              >
                {getLocalizedText(contentConfig, locale, 'ctaSubheadline', t("cta_subheadline"))}
              </motion.h2>

              {/* Sub-line penutup DIKEMBALIKAN 2026-11-17 atas perintah user (teks baru: "Daftar sebagai Pencari Peluang atau Pemberi Peluang."); sempat dihapus 2026-11-16 */}
              <motion.p variants={fadeUp} className="max-w-xl mx-auto text-[15.5px] sm:text-base text-foreground/70 leading-relaxed mb-8 text-center">
                {t("closing_subtitle")}
              </motion.p>

              <motion.div
                variants={fadeUp}
                className="flex items-center justify-center"
              >
                <div className="relative group inline-flex items-center justify-center">
                  {/* Subtle Refined Halo Glow */}
                  <div
                    aria-hidden="true"
                    className="absolute -inset-0.5 rounded-full blur-sm opacity-30 group-hover:opacity-45 transition-opacity duration-300 pointer-events-none"
                    style={{
                      background: "hsl(var(--brand-accent))",
                    }}
                  />

                  {/* Primary Button */}
                  <button
                    type="button"
                    onClick={() => setIsPartnershipModalOpen(true)}
                    className="relative inline-flex items-center justify-center gap-2.5 px-8 sm:px-9 h-12 rounded-full font-black text-sm sm:text-base text-neutral-950 transition-all duration-300 cursor-pointer overflow-hidden shadow-[0_2px_10px_hsl(var(--brand-accent)/0.25)] hover:shadow-[0_4px_16px_hsl(var(--brand-accent)/0.35)] hover:scale-[1.03] active:scale-[0.97] border border-white/20"
                    style={{
                      background: "hsl(var(--brand-accent))",
                    }}
                  >
                    {/* Top specular reflection */}
                    <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/80 to-transparent pointer-events-none" />

                    {/* Kilatan cahaya menyapu berkala (Periodic Light Flash) */}
                    <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/50 to-transparent pointer-events-none animate-btn-flash" />

                    {/* Kilatan cahaya ekstra saat kursor mengarah (Hover Flash) */}
                    <div className="absolute -inset-full w-[200%] h-full bg-gradient-to-r from-transparent via-white/40 to-transparent -skew-x-12 group-hover:translate-x-full transition-transform duration-1000 ease-out pointer-events-none" />

                    {/* Button text */}
                    <span className="relative z-10 font-black tracking-tight whitespace-nowrap">
                      {ctaButtonLabel}
                    </span>

                    {/* Arrow icon with hover forward slide */}
                    <ArrowIcon className={arrowIconCls} />
                  </button>
                </div>
              </motion.div>
              {/* Micro-copy closing DIHAPUS 2026-11-17 — isinya ("Untuk Pencari maupun Pemberi Peluang") sudah tercakup sub-line baru ("Daftar sebagai Pencari Peluang atau Pemberi Peluang."); closing_microcopy keys dormant untuk restore */}

              {/* Info harga KECIL DIHAPUS dari render 2026-11-16 ~21:52 atas perintah
                  user (ditambahkan 21:44, dihapus 8 menit kemudian). pricing_mini_*
                  keys (×10 locales) tetap ada di translations.ts untuk restore
                  satu baris. Backup: backups/hapus-harga-kecil-2026-11-16/ */}
            </Section>
          </div>
        </section>
      )}

      {/* ── ROTATING GLOBE (SEAMLESS CONTINUOUS BACKGROUND) ── */}
      <section className={`relative z-10 w-full overflow-hidden bg-background ${!ctaEnabled ? "pt-4 sm:pt-6" : ""}`}>
        <Suspense fallback={null}>
          <RotatingGlobe />
        </Suspense>
      </section>

      {/* ── FOOTER ── */}
      <footer className="border-t border-border/40 py-8 bg-background relative z-20 text-[13px] text-foreground/70">
        <div className="container mx-auto px-5 sm:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="text-[11.5px] text-foreground/60 font-mono text-center sm:text-start">
            {getLocalizedText(contentConfig, locale, 'footerCopyright', t("footer_copyright"))}
          </span>
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs">
            <button
              type="button"
              onClick={() => setActiveModal('about')}
              className="text-foreground/70 hover:text-foreground hover:underline transition-colors cursor-pointer font-medium"
            >
              {t("footer_company_about")}
            </button>
            <button
              type="button"
              onClick={() => setActiveModal('terms')}
              className="text-foreground/70 hover:text-foreground hover:underline transition-colors cursor-pointer font-medium"
            >
              {t("footer_terms")}
            </button>
            <button
              type="button"
              onClick={() => setActiveModal('privacy')}
              className="text-foreground/70 hover:text-foreground hover:underline transition-colors cursor-pointer font-medium"
            >
              {t("footer_privacy")}
            </button>
            <a
              href="mailto:halo@partnerfind.ai.id"
              className="text-foreground/70 hover:text-foreground hover:underline transition-colors cursor-pointer font-medium"
            >
              {t("footer_contact_us")}
            </a>
          </div>
        </div>
      </footer>

      {/* ── MODALS SYSTEM FOR TRANSPARENCY ── */}
      <AnimatePresence>
        {activeModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-md z-[100] flex items-center justify-center p-4"
            onClick={() => setActiveModal(null)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="relative bg-card border border-border rounded-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[85vh] text-start shadow-2xl text-card-foreground"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-muted/40">
                <div className="flex items-center gap-2">
                  {activeModal === 'about' && <Users className="w-5 h-5" style={{ color: "hsl(var(--brand-accent))" }} />}
                  {activeModal === 'terms' && <FileText className="w-5 h-5" style={{ color: "hsl(var(--brand-accent))" }} />}
                  {activeModal === 'privacy' && <ShieldCheck className="w-5 h-5" style={{ color: "hsl(var(--brand-accent))" }} />}
                  {activeModal === 'contact' && <MapPin className="w-5 h-5" style={{ color: "hsl(var(--brand-accent))" }} />}
                  {activeModal === 'share' && <Share2 className="w-5 h-5" style={{ color: "hsl(var(--brand-accent))" }} />}
                  <h3 className="font-bold text-lg text-foreground">
                    {activeModal === 'about' && t("footer_company_about")}
                    {activeModal === 'terms' && t("footer_terms")}
                    {activeModal === 'privacy' && t("footer_privacy")}
                    {activeModal === 'contact' && t("footer_company_contact")}
                    {activeModal === 'share' && shareConfig.shareTitle}
                  </h3>
                </div>
                <button
                  onClick={() => setActiveModal(null)}
                  className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Body with High-Contrast Readable Text */}
              <div className="p-6 overflow-y-auto space-y-4 text-sm text-foreground/80 leading-relaxed">
                {activeModal === 'share' && (
                  <div className="space-y-4">
                    <p className="text-sm text-foreground/80">
                      {shareConfig.shareMessage}
                    </p>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
                      <a
                        href={`https://api.whatsapp.com/send?text=${encodeURIComponent(shareConfig.shareMessage + "\n" + (typeof window !== "undefined" ? window.location.href : ""))}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-[#25D366]/15 hover:bg-[#25D366]/25 text-[#25D366] border border-[#25D366]/30 font-semibold text-xs transition-colors"
                      >
                        <span>WhatsApp</span>
                      </a>
                      <a
                        href={`https://t.me/share/url?url=${encodeURIComponent(typeof window !== "undefined" ? window.location.href : "")}&text=${encodeURIComponent(shareConfig.shareMessage)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-[#0088cc]/15 hover:bg-[#0088cc]/25 text-[#0088cc] border border-[#0088cc]/30 font-semibold text-xs transition-colors"
                      >
                        <span>Telegram</span>
                      </a>
                      <a
                        href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareConfig.shareMessage)}&url=${encodeURIComponent(typeof window !== "undefined" ? window.location.href : "")}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-foreground/10 hover:bg-foreground/15 text-foreground border border-foreground/20 font-semibold text-xs transition-colors"
                      >
                        <span>X / Twitter</span>
                      </a>
                      <a
                        href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(typeof window !== "undefined" ? window.location.href : "")}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-[#0A66C2]/15 hover:bg-[#0A66C2]/25 text-[#0A66C2] border border-[#0A66C2]/30 font-semibold text-xs transition-colors"
                      >
                        <span>LinkedIn</span>
                      </a>
                    </div>

                    <div className="pt-2">
                      <div className="flex items-center gap-2 bg-muted/70 border border-border rounded-xl p-1.5 ps-3">
                        <input
                          type="text"
                          readOnly
                          value={typeof window !== "undefined" ? window.location.href : ""}
                          className="bg-transparent text-xs text-foreground/80 w-full outline-none select-all font-mono"
                        />
                        <button
                          type="button"
                          onClick={async () => {
                            if (typeof window !== "undefined" && navigator.clipboard) {
                              await navigator.clipboard.writeText(window.location.href);
                              setShareCopied(true);
                              setTimeout(() => setShareCopied(false), 2500);
                            }
                          }}
                          className="px-3.5 py-1.5 rounded-lg font-semibold text-xs text-white shrink-0 transition-opacity hover:opacity-90 flex items-center gap-1.5 cursor-pointer"
                          style={{ background: "hsl(var(--brand-accent))" }}
                        >
                          {shareCopied ? (
                            <>
                              <Check className="w-3.5 h-3.5" />
                              <span>{shareConfig.copiedToast}</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" />
                              <span>{shareConfig.label}</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                )}
                {activeModal === 'about' && (
                  <>
                    <p>
                      {legalData.about.intro}
                    </p>
                    <p>
                      <strong className="text-foreground">{legalData.about.flowTitle}</strong>
                    </p>
                    <ul className="list-disc ps-5 space-y-1.5 text-foreground/80">
                      {legalData.about.steps.map((step, idx) => (
                        <li key={idx}>
                          <strong className="text-foreground">{step.bold} </strong>
                          {step.text}
                        </li>
                      ))}
                    </ul>
                  </>
                )}

                {activeModal === 'terms' && (
                  <div className="space-y-3">
                    <p>{legalData.terms.intro}</p>
                    <ul className="list-disc ps-5 space-y-2 text-foreground/80">
                      {legalData.terms.points.map((point, idx) => (
                        <li key={idx}>{point}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {activeModal === 'privacy' && (
                  <div className="space-y-3">
                    <p>{legalData.privacy.intro}</p>
                    <ul className="list-disc ps-5 space-y-2 text-foreground/80">
                      {legalData.privacy.points.map((point, idx) => (
                        <li key={idx}>{point}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {activeModal === 'contact' && (
                  <>
                    <p className="text-foreground/80">
                      {legalData.contact.intro}
                    </p>
                    {(legalData.contact.email || legalData.contact.phone) && (
                      <div className="bg-muted/70 p-4 rounded-xl border border-border space-y-2">
                        {legalData.contact.email && (
                          <div className="flex items-center gap-2 text-foreground/90">
                            <Mail className="w-4 h-4 text-sky-500" />
                            <span>{legalData.contact.email}</span>
                          </div>
                        )}
                        {legalData.contact.phone && (
                          <div className="flex items-center gap-2 text-foreground/90">
                            <Phone className="w-4 h-4 text-emerald-500" />
                            <span>{legalData.contact.phone}</span>
                          </div>
                        )}
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* Modal Footer */}
              <div className="p-4 border-t border-border bg-muted/40 flex justify-end">
                <button
                  onClick={() => setActiveModal(null)}
                  className="px-4 py-2 bg-muted hover:bg-muted/80 text-foreground rounded-xl text-xs font-semibold transition-colors cursor-pointer border border-border"
                >
                  {t("nav_close") || "Close"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tally registration form opened by the Hero and CTA buttons. */}
      <PartnershipFormModal
        isOpen={isPartnershipModalOpen}
        onClose={() => setIsPartnershipModalOpen(false)}
      />
    </div>
  );
}
