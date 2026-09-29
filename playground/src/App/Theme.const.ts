export const BORDER_RADIUS_HALF = 5;
export const BORDER_RADIUS_FULL = 10;

const SHADOW_SMALL = "0 2px 2px 0px rgba(0, 0, 0, 0.8)";
const SHADOW_MEDIUM = "0 4px 8px 0px rgba(0, 0, 0, 0.65)";
const SHADOW_LARGE = "0 16px 64px 0px rgba(0, 0, 0, 0.5)";

const SHARED_THEME_VALUES = {
    scheme: "dark",
    color: {
        info: {
            dark: "hsl(225, 50%, 40%)",
            main: "hsl(225, 75%, 50%)",
            light: "hsl(225, 50%, 50%)",
            contrast: "hsl(225, 100%, 100%)",
        },
        success: {
            dark: "hsl(90, 50%, 50%)",
            main: "hsl(90, 75%, 50%)",
            light: "hsl(90, 50%, 60%)",
            contrast: "hsl(90, 100%, 0%)",
        },
        alert: {
            dark: "hsl(45, 50%, 50%)",
            main: "hsl(45, 75%, 50%)",
            light: "hsl(45, 50%, 60%)",
            contrast: "hsl(45, 100%, 0%)",
        },
        error: {
            dark: "hsl(0, 50%, 40%)",
            main: "hsl(0, 75%, 50%)",
            light: "hsl(0, 50%, 50%)",
            contrast: "hsl(0, 100%, 100%)",
        },
        outline: {
            main: "rgb(255, 0, 255)",
        },
    },
    spacing: {
        half: "5px",
        full: "10px",
        double: "20px",
        quad: "40px",
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
            dark: "rgb(192, 192, 192)",
            main: "rgb(255, 255, 255)",
            light: "rgb(255, 255, 255)",
            contrast: "rgb(0, 0, 0)",
        },
        secondary: {
            dark: "rgb(192, 192, 192)",
            main: "rgb(255, 255, 255)",
            light: "rgb(255, 255, 255)",
            contrast: "rgb(0, 0, 0)",
        },
        background: {
            dark: "rgb(0, 0, 0)",
            light: "rgb(32, 32, 32)",
            contrast: "rgb(255, 255, 255)",
        },
        surface: {
            dark: "rgb(32, 32, 32)",
            light: "rgb(64, 64, 64)",
            contrast: "rgb(255, 255, 255)",
        },
        control: {
            level0: {
                main: "rgb(0, 0, 0)",
                contrast: "rgb(255, 255, 255)",
            },
            level1: {
                main: "rgb(32, 32, 32)",
                contrast: "rgb(255, 255, 255)",
            },
            level2: {
                main: "rgb(64, 64, 64)",
                contrast: "rgb(255, 255, 255)",
            },
        },
    },
} as const;

export const REACT_THEME_VALUES = {
    ...SHARED_THEME_VALUES,
    color: {
        ...SHARED_THEME_VALUES.color,
        primary: {
            dark: "hsl(195, 75%, 50%)",
            main: "hsl(180, 100%, 50%)",
            light: "hsl(180, 75%, 60%)",
            contrast: "hsl(180, 100%, 0%)",
        },
        secondary: {
            dark: "hsl(165, 75%, 50%)",
            main: "hsl(150, 100%, 50%)",
            light: "hsl(150, 75%, 60%)",
            contrast: "hsl(150, 100%, 0%)",
        },
        background: {
            dark: "hsl(240, 20%, 5%)",
            light: "hsl(210, 20%, 15%)",
            contrast: "hsl(210, 100%, 95%)",
        },
        surface: {
            dark: "hsl(0, 10%, 10%)",
            light: "hsl(30, 10%, 15%)",
            contrast: "hsl(30, 100%, 95%)",
        },
        control: {
            level0: {
                main: "hsl(240, 10%, 5%)",
                contrast: "hsl(210, 100%, 95%)",
            },
            level1: {
                main: "hsl(0, 10%, 5%)",
                contrast: "hsl(30, 100%, 95%)",
            },
            level2: {
                main: "rgb(0, 0, 0)",
                contrast: "rgb(255, 255, 255)",
            },
        },
    },
} as const;

export const SOLID_THEME_VALUES = {
    ...SHARED_THEME_VALUES,
    color: {
        ...SHARED_THEME_VALUES.color,
        primary: {
            dark: "hsl(195, 75%, 50%)",
            main: "hsl(180, 100%, 50%)",
            light: "hsl(180, 75%, 60%)",
            contrast: "hsl(180, 100%, 0%)",
        },
        secondary: {
            dark: "hsl(165, 75%, 50%)",
            main: "hsl(150, 100%, 50%)",
            light: "hsl(150, 75%, 60%)",
            contrast: "hsl(150, 100%, 0%)",
        },
        background: {
            dark: "hsl(0, 20%, 5%)",
            light: "hsl(30, 20%, 15%)",
            contrast: "hsl(30, 100%, 95%)",
        },
        surface: {
            dark: "hsl(240, 10%, 10%)",
            light: "hsl(210, 10%, 15%)",
            contrast: "hsl(210, 100%, 95%)",
        },
        control: {
            level0: {
                main: "hsl(0, 10%, 5%)",
                contrast: "hsl(30, 100%, 95%)",
            },
            level1: {
                main: "hsl(240, 10%, 5%)",
                contrast: "hsl(210, 100%, 95%)",
            },
            level2: {
                main: "rgb(0, 0, 0)",
                contrast: "rgb(255, 255, 255)",
            },
        },
    },
} as const;

export const SVELTE_THEME_VALUES = {
    ...SHARED_THEME_VALUES,
    color: {
        ...SHARED_THEME_VALUES.color,
        primary: {
            dark: "hsl(30, 75%, 50%)",
            main: "hsl(45, 100%, 50%)",
            light: "hsl(45, 75%, 60%)",
            contrast: "hsl(45, 100%, 0%)",
        },
        secondary: {
            dark: "hsl(0, 75%, 50%)",
            main: "hsl(15, 100%, 50%)",
            light: "hsl(15, 75%, 60%)",
            contrast: "hsl(15, 100%, 0%)",
        },
        background: {
            dark: "hsl(300, 20%, 5%)",
            light: "hsl(270, 20%, 15%)",
            contrast: "hsl(270, 100%, 95%)",
        },
        surface: {
            dark: "hsl(0, 10%, 10%)",
            light: "hsl(30, 10%, 15%)",
            contrast: "hsl(30, 100%, 95%)",
        },
        control: {
            level0: {
                main: "hsl(300, 10%, 5%)",
                contrast: "hsl(270, 100%, 95%)",
            },
            level1: {
                main: "hsl(0, 10%, 5%)",
                contrast: "hsl(30, 100%, 95%)",
            },
            level2: {
                main: "rgb(0, 0, 0)",
                contrast: "rgb(255, 255, 255)",
            },
        },
    },
} as const;

export const VUE_THEME_VALUES = {
    ...SHARED_THEME_VALUES,
    color: {
        ...SHARED_THEME_VALUES.color,
        primary: {
            dark: "hsl(105, 75%, 50%)",
            main: "hsl(90, 100%, 50%)",
            light: "hsl(90, 75%, 60%)",
            contrast: "hsl(135, 100%, 0%)",
        },
        secondary: {
            dark: "hsl(75, 75%, 50%)",
            main: "hsl(60, 100%, 50%)",
            light: "hsl(60, 75%, 60%)",
            contrast: "hsl(60, 100%, 0%)",
        },
        background: {
            dark: "hsl(0, 20%, 5%)",
            light: "hsl(30, 20%, 15%)",
            contrast: "hsl(0, 100%, 95%)",
        },
        surface: {
            dark: "hsl(135, 10%, 10%)",
            light: "hsl(90, 10%, 15%)",
            contrast: "hsl(90, 100%, 95%)",
        },
        control: {
            level0: {
                main: "hsl(0, 10%, 5%)",
                contrast: "hsl(30, 100%, 95%)",
            },
            level1: {
                main: "hsl(135, 10%, 5%)",
                contrast: "hsl(90, 100%, 95%)",
            },
            level2: {
                main: "rgb(0, 0, 0)",
                contrast: "rgb(255, 255, 255)",
            },
        },
    },
} as const;
