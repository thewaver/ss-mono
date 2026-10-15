import type { Color } from "@thewaver/ss-utils";

import type { ColorFamily } from "./Theme.const.ts";

const toHslCss = (hsl: Color.HSL) => `hsl(${hsl.h} ${hsl.s}% ${hsl.l}%)`;

export const toCssFamily = (family: ColorFamily) => ({
    dark: toHslCss(family.dark),
    main: toHslCss(family.main),
    light: toHslCss(family.light),
    contrast: toHslCss(family.contrast),
});

export const toBackdropGradient = (light: string, dark: string) => `linear-gradient(135deg, ${light}, ${dark})`;
