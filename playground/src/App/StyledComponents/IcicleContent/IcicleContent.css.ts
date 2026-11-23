import { style, styleVariants } from "@vanilla-extract/css";

import { skinEntries } from "../../Skins/Skin.css";
import { RAINBOW, RAINBOW_HUES, themeVars } from "../../Theme.css";

export const PAGE_ICICLE_FAMILIES = RAINBOW_HUES;

const panel = (from: string, to: string) => `linear-gradient(215deg, ${from}, ${to})`;

export const icicleCellFamily = styleVariants(
    Object.fromEntries(
        PAGE_ICICLE_FAMILIES.map((family) => [
            family,
            {
                backgroundImage: panel(RAINBOW[family].light, RAINBOW[family].dark),
                color: RAINBOW[family].contrast,
            },
        ]),
    ),
);

export const icicleCell = style({
    borderBottom: "1px solid color-mix(in srgb, currentColor 25%, transparent)",
    borderRight: "1px solid color-mix(in srgb, currentColor 25%, transparent)",
    width: "100%",
    height: "100%",
    padding: `2px ${themeVars.spacing.half}`,
    fontSize: themeVars.fontSize.xSmall,
    whiteSpace: "nowrap",
    overflow: "hidden",
    cursor: "pointer",
});

export const icicleCellRoot = style([skinEntries.itemStatic]);

export const icicleLabel = style({
    transition: `opacity ${themeVars.animation.duration}`,
});

export const icicleWeight = style({
    opacity: 0.7,
});
