// ─── Design Tokens ────────────────────────────────────────────────────────────

export const colors = {
  // Backgrounds
  background:   "#0F0F1A",   // near-black deep navy
  surface:      "#1A1A2E",   // card surface
  surfaceHigh:  "#22223A",   // elevated surface
  surfaceBorder:"#2D2D4A",   // subtle border

  // Brand gradient endpoints
  primary:      "#7C3AED",   // violet-600
  primaryLight: "#A78BFA",   // violet-400
  primaryDark:  "#5B21B6",   // violet-800
  accent:       "#06B6D4",   // cyan-500

  // Semantic
  success:      "#10B981",   // emerald-500
  danger:       "#F43F5E",   // rose-500
  warning:      "#F59E0B",   // amber-500

  // Text
  text:         "#F1F5F9",   // slate-100
  textSecondary:"#94A3B8",   // slate-400
  textMuted:    "#475569",   // slate-600

  // Legacy aliases (keep for backward compat)
  card:         "#1A1A2E",
  subtext:      "#94A3B8",
  border:       "#2D2D4A",
};

export const spacing = {
  xs:  4,
  sm:  8,
  md:  16,
  lg:  24,
  xl:  32,
  xxl: 48,
};

export const radius = {
  sm:  8,
  md:  14,
  lg:  20,
  xl:  28,
  full: 9999,
};

export const shadows = {
  sm: {
    shadowColor: "#7C3AED",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 3,
  },
  md: {
    shadowColor: "#7C3AED",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 8,
  },
  lg: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.4,
    shadowRadius: 24,
    elevation: 16,
  },
};

export const typography = {
  hero:    { fontSize: 36, fontWeight: "800" as const, letterSpacing: -1 },
  h1:      { fontSize: 28, fontWeight: "800" as const, letterSpacing: -0.5 },
  h2:      { fontSize: 22, fontWeight: "700" as const, letterSpacing: -0.3 },
  h3:      { fontSize: 18, fontWeight: "700" as const },
  body:    { fontSize: 15, fontWeight: "400" as const },
  label:   { fontSize: 13, fontWeight: "600" as const, letterSpacing: 0.3 },
  caption: { fontSize: 12, fontWeight: "400" as const },
  overline:{ fontSize: 11, fontWeight: "700" as const, letterSpacing: 1.5 },
};
