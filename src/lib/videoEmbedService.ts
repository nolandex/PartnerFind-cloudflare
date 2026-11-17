import { subscribeJson } from "./cloudflareApi";

export interface VideoEmbedConfig {
  enabled: boolean;
  youtubeVideoId?: string;
  mp4Url?: string;
  mp4Poster?: string;
  gifData?: string;
  gifUrl?: string;
  gifPerLocale?: Record<string, string>;
  perLocale?: Record<string, string>;
  updatedAt?: number;
  updatedBy?: string;
}
const SETTINGS_ID = "video_config";
const LOCAL_STORAGE_KEY = "collab_video_settings_v1";
const DEFAULT_VIDEO_CONFIG: VideoEmbedConfig = {
  enabled: true,
  youtubeVideoId: "usbpo8zE3W4",
  perLocale: {
    "id-ID": "usbpo8zE3W4",
    "en-US": "YUSzBjAD1UU",
    "es-ES": "z9_V3JYVz8o",
    "fr-FR": "mW5Ada1HLT8",
    "ja-JP": "SR_vuyHkCb4",
    "ar-SA": "DnG8s0_h7QA",
    "ru-RU": "NvYw9sXjmAg",
    "ko-KR": "7TdM_63KTEk",
    "zh-CN": "ntEsj7xj-TQ",
    "pt-PT": "6-mLAPVMJFo",
  },
};
export function getVideoIdForLocale(config: VideoEmbedConfig, locale: string): string {
  return config.perLocale?.[locale] || config.youtubeVideoId || DEFAULT_VIDEO_CONFIG.youtubeVideoId || "usbpo8zE3W4";
}

export function getCachedVideoConfig(): VideoEmbedConfig {
  try { return { ...DEFAULT_VIDEO_CONFIG, ...JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || "null") }; }
  catch { return DEFAULT_VIDEO_CONFIG; }
}
export function subscribeVideoConfig(callback: (config: VideoEmbedConfig) => void): () => void {
  return subscribeJson(`/api/settings/${SETTINGS_ID}`, (raw) => {
    const config = { ...DEFAULT_VIDEO_CONFIG, ...(raw || {}) };
    try { localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(config)); } catch {}
    callback(config);
  }, DEFAULT_VIDEO_CONFIG);
}
