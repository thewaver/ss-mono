const DEFAULT_GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#%&@*+=<>/\\";

export const SCRAMBLE_TEXT_DEFAULTS = {
    computeGlyphs: (): string => DEFAULT_GLYPHS,
    settleDurationMs: 1000,
    scrambleIntervalMs: 50,
};
