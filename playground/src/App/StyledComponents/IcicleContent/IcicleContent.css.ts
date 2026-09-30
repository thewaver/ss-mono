import { style, styleVariants } from "@vanilla-extract/css";

import { RAINBOW, RAINBOW_HUES, themeVars } from "../../Theme.css";
import { layerVars } from "../Layer/Layer.css";

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
    width: "100%",
    height: "100%",
    padding: `2px ${themeVars.spacing.half}`,
    borderRight: `1px solid rgb(from ${layerVars.contrast} r g b / 25%)`,
    borderBottom: `1px solid rgb(from ${layerVars.contrast} r g b / 25%)`,
    fontSize: themeVars.fontSize.xSmall,
    whiteSpace: "nowrap",
    overflow: "hidden",
    cursor: "pointer",
});

export const icicleCellRoot = style({
    backgroundColor: layerVars.main,
    color: layerVars.contrast,
});

export const icicleLabel = style({
    transition: `opacity ${themeVars.animation.duration}`,
});

export const icicleWeight = style({
    opacity: 0.7,
});
