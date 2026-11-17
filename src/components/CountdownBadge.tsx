import React, { useState, useEffect, memo } from "react";
import { Timer } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import {
  AnnouncementBarConfig,
  getCachedAnnouncement,
  subscribeAnnouncement,
} from "../lib/announcementService";
import {
  getCachedWebsiteContent,
  subscribeWebsiteContent,
  getLocalizedText
} from "../lib/websiteContentService";
import { UNIT_LABELS } from "./HeroCountdown";

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isExpired: boolean;
}

function calculateTimeLeft(targetIso: string): TimeLeft {
  const targetMs = new Date(targetIso).getTime();
  const nowMs = Date.now();
  const difference = targetMs - nowMs;

  if (isNaN(targetMs) || difference <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true };
  }

  const days = Math.floor(difference / (1000 * 60 * 60 * 24));
  const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((difference / (1000 * 60)) % 60);
  const seconds = Math.floor((difference / 1000) % 60);

  return { days, hours, minutes, seconds, isExpired: false };
}

/**
 * Compact countdown badge at the top of the hero (replaces the full
 * HeroCountdown block). Shows the launching title + a ticking time:
 * "{N} hari HH:MM:SS", e.g. "Meluncur dalam 15 hari 00:54:57".
 * When under 24h remain, only the clock shows. Hidden when
 * the announcement config is disabled or the target date has passed.
 * (Days + clock format 2026-11-16, revisi Claude; the pill wraps
 * gracefully on narrow screens.)
 */
export const CountdownBadge: React.FC = memo(() => {
  const { locale } = useLanguage();
  const [config, setConfig] = useState<AnnouncementBarConfig>(getCachedAnnouncement);
  const [contentConfig, setContentConfig] = useState(getCachedWebsiteContent);
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(() =>
    calculateTimeLeft(config.targetDate)
  );

  useEffect(() => {
    const unsubscribeAnnouncement = subscribeAnnouncement((updated) => {
      setConfig(updated);
      setTimeLeft(calculateTimeLeft(updated.targetDate));
    });
    const unsubscribeContent = subscribeWebsiteContent((updated) => {
      setContentConfig(updated);
    });
    return () => {
      unsubscribeAnnouncement();
      unsubscribeContent();
    };
  }, []);

  useEffect(() => {
    if (!config.enabled) return;
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft(config.targetDate));
    }, 1000);
    return () => clearInterval(timer);
  }, [config.enabled, config.targetDate]);

  if (!config.enabled || timeLeft.isExpired) return null;

  const strings = UNIT_LABELS[locale] || UNIT_LABELS["id-ID"];

  // Display message follows the visitor's language: an admin countdownTitle
  // saved for this specific locale wins; otherwise use the locale's own title.
  const displayMessage =
    getLocalizedText(contentConfig, locale, 'countdownTitle', '') || strings.title;

  // Ticking time (revisi Claude 2026-11-16): "{N} hari HH:MM:SS" — days as a
  // number + the FULL day word, then a ticking clock. When under 24h remain,
  // the days part drops and only the clock shows. E.g. "Meluncur dalam
  // 15 hari 00:54:57".
  const pad = (n: number) => String(n).padStart(2, "0");
  const clock = `${pad(timeLeft.hours)}:${pad(timeLeft.minutes)}:${pad(timeLeft.seconds)}`;
  const timeText =
    timeLeft.days > 0
      ? `${timeLeft.days} ${strings.days.toLowerCase()} ${clock}`
      : clock;

  return (
    <div className="mb-5 sm:mb-6">
      <span className="inline-flex flex-wrap items-center justify-center gap-1.5 rounded-3xl border border-white/10 bg-white/5 px-3 py-1.5 text-xs sm:text-sm font-medium text-foreground/80 select-none tabular-nums text-center">
        <Timer
          className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0"
          style={{ color: "hsl(var(--brand-accent))" }}
        />
        <span>{displayMessage} {timeText}</span>
      </span>
    </div>
  );
});
