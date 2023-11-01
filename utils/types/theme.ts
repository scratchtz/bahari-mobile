export const DISPLAY_THEMES = ['system', 'light', 'dark', 'dark-zero'] as const;
export type DisplayTheme = (typeof DISPLAY_THEMES)[number];
