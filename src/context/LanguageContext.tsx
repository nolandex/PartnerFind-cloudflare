import { createContext, useContext, useState, useEffect, useCallback, useMemo, ReactNode } from "react";
import { Locale, translations } from "../lib/translations";

const STORAGE_KEY = "nexclass-locale";

interface LanguageContextType {
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: (key: string) => string;
  formatPrice: (price: number) => string;
}

const LanguageContext = createContext<LanguageContextType>({
  locale: "id-ID" as Locale,
  setLocale: () => {},
  t: (key: string) => key,
  formatPrice: (price: number) => `$${price}`,
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY) || localStorage.getItem("nexclass-locale-v2");
      if (saved && translations[saved as Locale]) return saved as Locale;
    } catch {
      // localStorage may be unavailable
    }
    return "id-ID";
  });

  const activeTranslation = useMemo(() => {
    return translations[locale] || translations["id-ID"] || translations["en-US"];
  }, [locale]);

  const setLocale = useCallback((l: Locale) => {
    if (!translations[l]) return;
    setLocaleState(l);
    try {
      localStorage.setItem(STORAGE_KEY, l);
      localStorage.setItem("nexclass-locale-v2", l);
    } catch {
      // ignore storage errors
    }
  }, []);

  useEffect(() => {
    // RTL untuk Arab; LTR untuk locale lain (2026-11-15)
    document.documentElement.dir = locale === "ar-SA" ? "rtl" : "ltr";
    const titles: Record<string, string> = {
      "id-ID": "PartnerFind - Platform Kerja Sama Global",
      "en-US": "PartnerFind - Global Partnership Platform",
      "es-ES": "PartnerFind - Plataforma Global de Colaboración",
      "fr-FR": "PartnerFind - Plateforme Mondiale de Partenariat",
      "ja-JP": "PartnerFind - グローバルパートナーシッププラットフォーム",
      "zh-CN": "PartnerFind - 全球合作平台",
      "ar-SA": "PartnerFind - منصة الشراكة العالمية",
      "ko-KR": "PartnerFind - 글로벌 파트너십 플랫폼",
      "pt-PT": "PartnerFind - Plataforma Global de Parcerias",
      "ru-RU": "PartnerFind - Глобальная платформа партнёрства",
    };
    document.title = titles[locale] || titles["id-ID"];
  }, [locale]);

  const t = useCallback(
    (key: string) => {
      return (activeTranslation as any)[key] || key;
    },
    [activeTranslation]
  );

  const formatPrice = useCallback((price: number) => `$${price}`, []);

  const value = useMemo(
    () => ({ locale, setLocale, t, formatPrice }),
    [locale, setLocale, t, formatPrice]
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
