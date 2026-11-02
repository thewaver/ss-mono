import { style } from "@vanilla-extract/css";

import { lookEntries } from "../../Looks/Look.css";
import { themeVars } from "../../Theme.css";
import { layerVars } from "../Layer/Layer.css";

const SURFACE_PADDING = 5;
const SURFACE_BORDER = 2;

export const POPOVER_SURFACE_INSET = SURFACE_PADDING + SURFACE_BORDER;

export const isVisible = style({});
export const isFlipped = style({});

export const popoverSurfaceEmpty = style({
    padding: themeVars.spacing.full,
    color: `rgb(from ${layerVars.contrast} r g b / 50%)`,
    fontSize: themeVars.fontSize.medium,
    whiteSpace: "nowrap",
});

export const popoverSurface = style([
    lookEntries.dropdown,
    {
        boxSizing: "border-box",
        width: "100%",
        maxHeight: 220,
        overflowY: "auto",
        padding: SURFACE_PADDING,
        scrollPadding: SURFACE_PADDING,
        opacity: 0,
        transform: "translateY(-4px)",

        selectors: {
            [`&.${isFlipped}`]: {
                transform: "translateY(4px)",
            },
            [`&.${isVisible}`]: {
                opacity: 1,
                transform: "translateY(0)",
            },
        },
    },
]);
