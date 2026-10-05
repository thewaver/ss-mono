export const MORPH_WORDS = ["Melt", "Morph", "Blend", "Merge", "Shift"];

export const PAINTED_WORDS = ["Gradient", "Pattern", "Shimmer", "Glow"];

export const MORPH_PAINT = { kind: "timed" as const, key: "flow_diag_3" as const, configDefs: {} };

export const MORPH_PAINT_TIMING = {
    animationDurationMs: 2000,
    iterationConfigKey: "constant" as const,
    cellSize: { width: 24, height: 24 },
};
