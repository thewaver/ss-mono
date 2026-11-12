import type { Color } from "@thewaver/ss-utils";

export const BORDER_RADIUS_HALF = 5;
export const BORDER_RADIUS_FULL = 10;

const SHADOW_SMALL = "0 2px 2px 0px rgba(0, 0, 0, 0.65)";
const SHADOW_MEDIUM = "0 4px 8px 0px rgba(0, 0, 0, 0.5)";
const SHADOW_LARGE = "0 16px 64px 0px rgba(0, 0, 0, 0.35)";

export type ColorFamily = { dark: Color.HSL; main: Color.HSL; light: Color.HSL; contrast: Color.HSL };

const SHARED_THEME_VALUES = {
    scheme: "dark",
    color: {
        info: {
            dark: "hsl(210, 100%, 55%)",
            main: "hsl(210, 100%, 60%)",
            light: "hsl(210, 100%, 65%)",
            contrast: "hsl(210, 100%, 0%)",
        },
        success: {
            dark: "hsl(90, 100%, 45%)",
            main: "hsl(90, 100%, 50%)",
            light: "hsl(90, 100%, 55%)",
            contrast: "hsl(90, 100%, 0%)",
        },
        alert: {
            dark: "hsl(45, 100%, 45%)",
            main: "hsl(45, 100%, 50%)",
            light: "hsl(45, 100%, 55%)",
            contrast: "hsl(45, 100%, 0%)",
        },
        error: {
            dark: "hsl(15, 100%, 55%)",
            main: "hsl(15, 100%, 60%)",
            light: "hsl(15, 100%, 65%)",
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

const DEFAULT_PRIMARY: ColorFamily = {
    dark: { h: 0, s: 0, l: 85 },
    main: { h: 0, s: 0, l: 90 },
    light: { h: 0, s: 0, l: 95 },
    contrast: { h: 0, s: 0, l: 0 },
};

const CONTRAST_PRIMARY: ColorFamily = {
    dark: { h: 120, s: 100, l: 55 },
    main: { h: 120, s: 100, l: 60 },
    light: { h: 120, s: 100, l: 65 },
    contrast: { h: 90, s: 100, l: 0 },
};

const REACT_PRIMARY: ColorFamily = {
    dark: { h: 195, s: 100, l: 45 },
    main: { h: 180, s: 100, l: 50 },
    light: { h: 180, s: 100, l: 55 },
    contrast: { h: 180, s: 100, l: 0 },
};

const SOLID_PRIMARY: ColorFamily = {
    dark: { h: 195, s: 100, l: 45 },
    main: { h: 180, s: 100, l: 50 },
    light: { h: 180, s: 100, l: 55 },
    contrast: { h: 180, s: 100, l: 0 },
};

const SVELTE_PRIMARY: ColorFamily = {
    dark: { h: 30, s: 100, l: 45 },
    main: { h: 45, s: 100, l: 50 },
    light: { h: 45, s: 100, l: 55 },
    contrast: { h: 45, s: 100, l: 0 },
};

const VUE_PRIMARY: ColorFamily = {
    dark: { h: 105, s: 100, l: 45 },
    main: { h: 90, s: 100, l: 50 },
    light: { h: 90, s: 100, l: 55 },
    contrast: { h: 90, s: 100, l: 0 },
};

export const DEFAULT_THEME_VALUES = {
    ...SHARED_THEME_VALUES,
    color: {
        ...SHARED_THEME_VALUES.color,
        primary: DEFAULT_PRIMARY,
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
        primary: CONTRAST_PRIMARY,
        layers: {
            level0: {
                dark: "hsl(210, 100%, 15%)",
                main: "hsl(210, 100%, 20%)",
                light: "hsl(210, 100%, 25%)",
                contrast: "hsl(210, 100%, 95%)",
            },
            level1: {
                dark: "hsl(30, 100%, 15%)",
                main: "hsl(30, 100%, 20%)",
                light: "hsl(30, 100%, 25%)",
                contrast: "hsl(30, 100%, 95%)",
            },
            level2: {
                dark: "hsl(300, 100%, 15%)",
                main: "hsl(300, 100%, 20%)",
                light: "hsl(300, 100%, 25%)",
                contrast: "hsl(300, 100%, 95%)",
            },
        },
    },
} as const;

export const REACT_THEME_VALUES = {
    ...SHARED_THEME_VALUES,
    color: {
        ...SHARED_THEME_VALUES.color,
        primary: REACT_PRIMARY,
        layers: {
            level0: {
                dark: "hsl(210, 20%, 15%)",
                main: "hsl(210, 20%, 20%)",
                light: "hsl(210, 20%, 25%)",
                contrast: "hsl(210, 100%, 95%)",
            },
            level1: {
                dark: "hsl(30, 20%, 15%)",
                main: "hsl(30, 20%, 20%)",
                light: "hsl(30, 20%, 25%)",
                contrast: "hsl(30, 100%, 95%)",
            },
            level2: {
                dark: "hsl(30, 20%, 10%)",
                main: "hsl(30, 20%, 15%)",
                light: "hsl(30, 20%, 20%)",
                contrast: "hsl(30, 100%, 95%)",
            },
        },
    },
} as const;

export const SOLID_THEME_VALUES = {
    ...SHARED_THEME_VALUES,
    color: {
        ...SHARED_THEME_VALUES.color,
        primary: SOLID_PRIMARY,
        layers: {
            level0: {
                dark: "hsl(30, 20%, 15%)",
                main: "hsl(30, 20%, 20%)",
                light: "hsl(30, 20%, 25%)",
                contrast: "hsl(30, 100%, 95%)",
            },
            level1: {
                dark: "hsl(210, 20%, 15%)",
                main: "hsl(210, 20%, 20%)",
                light: "hsl(210, 20%, 25%)",
                contrast: "hsl(210, 100%, 95%)",
            },
            level2: {
                dark: "hsl(210, 20%, 10%)",
                main: "hsl(210, 20%, 15%)",
                light: "hsl(210, 20%, 20%)",
                contrast: "hsl(210, 100%, 95%)",
            },
        },
    },
} as const;

export const SVELTE_THEME_VALUES = {
    ...SHARED_THEME_VALUES,
    color: {
        ...SHARED_THEME_VALUES.color,
        primary: SVELTE_PRIMARY,
        layers: {
            level0: {
                dark: "hsl(270, 20%, 15%)",
                main: "hsl(270, 20%, 20%)",
                light: "hsl(270, 20%, 25%)",
                contrast: "hsl(270, 100%, 95%)",
            },
            level1: {
                dark: "hsl(30, 20%, 15%)",
                main: "hsl(30, 20%, 20%)",
                light: "hsl(30, 20%, 25%)",
                contrast: "hsl(30, 100%, 95%)",
            },
            level2: {
                dark: "hsl(30, 20%, 10%)",
                main: "hsl(30, 20%, 15%)",
                light: "hsl(30, 20%, 20%)",
                contrast: "hsl(30, 100%, 95%)",
            },
        },
    },
} as const;

export const VUE_THEME_VALUES = {
    ...SHARED_THEME_VALUES,
    color: {
        ...SHARED_THEME_VALUES.color,
        primary: VUE_PRIMARY,
        layers: {
            level0: {
                dark: "hsl(30, 20%, 15%)",
                main: "hsl(30, 20%, 20%)",
                light: "hsl(30, 20%, 25%)",
                contrast: "hsl(30, 100%, 95%)",
            },
            level1: {
                dark: "hsl(90, 20%, 15%)",
                main: "hsl(90, 20%, 20%)",
                light: "hsl(90, 20%, 25%)",
                contrast: "hsl(90, 100%, 95%)",
            },
            level2: {
                dark: "hsl(90, 20%, 10%)",
                main: "hsl(90, 20%, 15%)",
                light: "hsl(90, 20%, 20%)",
                contrast: "hsl(90, 100%, 95%)",
            },
        },
    },
} as const;
