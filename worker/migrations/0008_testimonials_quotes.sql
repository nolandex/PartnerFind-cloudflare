-- Quote testimoni per bahasa (JSON: { "id-ID": "...", "en-US": "...", ... }).
-- Kolom quote lama tetap dipakai sebagai fallback utama.
ALTER TABLE testimonials ADD COLUMN quotes TEXT;
