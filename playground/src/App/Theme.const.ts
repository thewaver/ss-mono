import type { Color } from "@thewaver/ss-utils";

import { toCssFamily } from "./Theme.utils";

export const BORDER_RADIUS_HALF = 5;
export const BORDER_RADIUS_FULL = 10;

const SHADOW_SMALL = "0 2px 2px 0px rgba(0, 0, 0, 0.75)";
const SHADOW_MEDIUM = "0 4px 8px 0px rgba(0, 0, 0, 0.5)";
const SHADOW_LARGE = "0 16px 64px 0px rgba(0, 0, 0, 0.25)";

export type ColorFamily = { dark: Color.HSL; main: Color.HSL; light: Color.HSL; contrast: Color.HSL };

const SHARED_THEME_VALUES = {
    scheme: "dark",
    color: {
        info: {
            dark: "hsl(195, 100%, 50%)",
            main: "hsl(195, 100%, 60%)",
            light: "hsl(195, 100%, 70%)",
            contrast: "hsl(195, 100%, 0%)",
        },
        success: {
            dark: "hsl(75, 100%, 40%)",
            main: "hsl(75, 100%, 50%)",
            light: "hsl(75, 100%, 60%)",
            contrast: "hsl(75, 100%, 0%)",
        },
        alert: {
            dark: "hsl(45, 100%, 40%)",
            main: "hsl(45, 100%, 50%)",
            light: "hsl(45, 100%, 60%)",
            contrast: "hsl(45, 100%, 0%)",
        },
        error: {
            dark: "hsl(15, 100%, 50%)",
            main: "hsl(15, 100%, 60%)",
            light: "hsl(15, 100%, 70%)",
            contrast: "hsl(15, 100%, 0%)",
        },
        outline: {
            main: "rgb(255, 0, 255)",
        },
    },
    spacing: {
        quarter: "2px",
        half: "4px",
        full: "8px",
        double: "16px",
        quad: "32px",
    },
    fontSize: {
        xSmall: "0.75rem",
        small: "0.875rem",
        medium: "1rem",
        large: "1.5rem",
        xLarge: "2rem",
    },
    borderRadius: {
        half: `${BORDER_RADIUS_HALF}px`,
        full: `${BORDER_RADIUS_FULL}px`,
    },
    shadow: {
        small: SHADOW_SMALL,
        medium: `${SHADOW_SMALL}, ${SHADOW_MEDIUM}`,
        large: `${SHADOW_SMALL}, ${SHADOW_MEDIUM}, ${SHADOW_LARGE}`,
    },
    hover: {
        filter: "brightness(125%)",
    },
    active: {
        filter: "brightness(75%)",
    },
    disabled: {
        opacity: "0.5",
        filter: "saturate(0.5)",
    },
    animation: {
        duration: "100ms",
    },
} as const;

export const DEFAULT_THEME_VALUES = {
    ...SHARED_THEME_VALUES,
    color: {
        ...SHARED_THEME_VALUES.color,
        primary: {
            dark: { h: 0, s: 0, l: 70 },
            main: { h: 0, s: 0, l: 80 },
            light: { h: 0, s: 0, l: 90 },
            contrast: { h: 0, s: 0, l: 0 },
        },
        layers: {
            level0: {
                dark: "rgb(0, 0, 0)",
                main: "rgb(12, 12, 12)",
                light: "rgb(24, 24, 24)",
                contrast: "rgb(255, 255, 255)",
            },
            level1: {
                dark: "rgb(36, 36, 36)",
                main: "rgb(48, 48, 48)",
                light: "rgb(60, 60, 60)",
                contrast: "rgb(255, 255, 255)",
            },
            level2: {
                dark: "rgb(72, 72, 72)",
                main: "rgb(84, 84, 84)",
                light: "rgb(96, 96, 96)",
                contrast: "rgb(255, 255, 255)",
            },
        },
    },
} as const;

export const CONTRAST_THEME_VALUES = {
    ...SHARED_THEME_VALUES,
    color: {
        ...SHARED_THEME_VALUES.color,
        primary: {
            dark: { h: 120, s: 100, l: 40 },
            main: { h: 120, s: 100, l: 50 },
            light: { h: 120, s: 100, l: 60 },
            contrast: { h: 90, s: 100, l: 0 },
        },
        layers: {
            level0: {
                dark: "hsl(210, 100%, 10%)",
                main: "hsl(210, 100%, 20%)",
                light: "hsl(210, 100%, 30%)",
                contrast: "hsl(210, 100%, 90%)",
            },
            level1: {
                dark: "hsl(30, 100%, 10%)",
                main: "hsl(30, 100%, 20%)",
                light: "hsl(30, 100%, 30%)",
                contrast: "hsl(30, 100%, 90%)",
            },
            level2: {
                dark: "hsl(300, 100%, 10%)",
                main: "hsl(300, 100%, 20%)",
                light: "hsl(300, 100%, 30%)",
                contrast: "hsl(300, 100%, 90%)",
            },
        },
    },
} as const;

const PRIMARY_GOLD: ColorFamily = {
    dark: { h: 45, s: 100, l: 40 },
    main: { h: 45, s: 100, l: 50 },
    light: { h: 45, s: 100, l: 60 },
    contrast: { h: 45, s: 100, l: 0 },
};

const PRIMARY_LIME: ColorFamily = {
    dark: { h: 90, s: 100, l: 40 },
    main: { h: 90, s: 100, l: 50 },
    light: { h: 90, s: 100, l: 60 },
    contrast: { h: 90, s: 100, l: 0 },
};

const PRIMARY_CYAN: ColorFamily = {
    dark: { h: 180, s: 100, l: 40 },
    main: { h: 180, s: 100, l: 50 },
    light: { h: 180, s: 100, l: 60 },
    contrast: { h: 180, s: 100, l: 0 },
};

const SURFACE_CHESTNUT: ColorFamily = {
    dark: { h: 30, s: 20, l: 15 },
    main: { h: 30, s: 20, l: 20 },
    light: { h: 30, s: 20, l: 25 },
    contrast: { h: 30, s: 100, l: 95 },
};

const SURFACE_OLIVE: ColorFamily = {
    dark: { h: 90, s: 20, l: 15 },
    main: { h: 90, s: 20, l: 20 },
    light: { h: 90, s: 20, l: 25 },
    contrast: { h: 90, s: 100, l: 95 },
};

const SURFACE_SLATE: ColorFamily = {
    dark: { h: 210, s: 20, l: 15 },
    main: { h: 210, s: 20, l: 20 },
    light: { h: 210, s: 20, l: 25 },
    contrast: { h: 210, s: 100, l: 95 },
};

const SURFACE_PLUM: ColorFamily = {
    dark: { h: 300, s: 20, l: 15 },
    main: { h: 300, s: 20, l: 20 },
    light: { h: 300, s: 20, l: 25 },
    contrast: { h: 300, s: 100, l: 95 },
};

const PRIMARIES = {
    gold: PRIMARY_GOLD,
    lime: PRIMARY_LIME,
    cyan: PRIMARY_CYAN,
};

const SURFACES = {
    chestnut: SURFACE_CHESTNUT,
    olive: SURFACE_OLIVE,
    slate: SURFACE_SLATE,
    plum: SURFACE_PLUM,
};

type SurfaceName = keyof typeof SURFACES;

type PrimaryName = keyof typeof PRIMARIES;

export type MixedThemeName = `${SurfaceName}_${SurfaceName}_${PrimaryName}`;

const SURFACE_PRIMARY_SUPPORT: Record<SurfaceName, Set<PrimaryName>> = {
    chestnut: new Set(["gold"]),
    olive: new Set(["lime"]),
    slate: new Set(["cyan"]),
    plum: new Set(["gold"]),
};

const toMixedTheme = (S1: ColorFamily, S2: ColorFamily, primary: ColorFamily) => ({
    ...SHARED_THEME_VALUES,
    color: {
        ...SHARED_THEME_VALUES.color,
        primary,
        layers: {
            level0: toCssFamily(S1),
            level1: toCssFamily(S2),
            level2: toCssFamily({
                dark: { ...S2.dark, l: S2.dark.l - 5 },
                main: { ...S2.main, l: S2.main.l - 5 },
                light: { ...S2.light, l: S2.light.l - 5 },
                contrast: S2.contrast,
            }),
        },
    },
});

const MIXED_THEMES = Object.fromEntries(
    Object.entries(SURFACES).flatMap(([name1, S1]) =>
        Object.entries(SURFACES)
            .filter(([name2]) => name1 !== name2)
            .flatMap(([name2, S2]) =>
                Object.entries(PRIMARIES)
                    .filter(([primaryName]) =>
                        SURFACE_PRIMARY_SUPPORT[name2 as SurfaceName].has(primaryName as PrimaryName),
                    )
                    .map(([primaryName, primary]) => [
                        `${name1}_${name2}_${primaryName}`,
                        toMixedTheme(S1, S2, primary),
                    ]),
            ),
    ),
) as Record<MixedThemeName, ReturnType<typeof toMixedTheme>>;

export const ALL_THEMES = {
    default: DEFAULT_THEME_VALUES,
    contrast: CONTRAST_THEME_VALUES,
    ...MIXED_THEMES,
};
