import { style, styleVariants } from "@vanilla-extract/css";

import { RAINBOW, RAINBOW_HUES, themeVars } from "../../Theme.css";
import { layerVars } from "../Layer/Layer.css";

export const PAGE_MOSAIC_FAMILIES = RAINBOW_HUES;

export const mosaicTile = style({
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "space-between",
    boxSizing: "border-box",
    padding: themeVars.spacing.half,
    borderRadius: themeVars.borderRadius.half,
    boxShadow: themeVars.shadow.small,
    fontSize: themeVars.fontSize.xSmall,
    overflow: "hidden",
});

export const mosaicTileFamily = styleVariants(
    Object.fromEntries(
        PAGE_MOSAIC_FAMILIES.map((family) => [
            family,
            {
                backgroundImage: `linear-gradient(45deg, ${RAINBOW[family].dark}, ${RAINBOW[family].light})`,
                color: RAINBOW[family].contrast,
            },
        ]),
    ),
);

export const mosaicTileName = style({
    fontSize: themeVars.fontSize.small,
    whiteSpace: "nowrap",
});

export const mosaicTileReading = style({
    opacity: 0.75,
});

export const mosaicLink = style({
    position: "relative",
    display: "block",
    overflow: "hidden",
    borderRadius: themeVars.borderRadius.half,
    transition: "transform 150ms ease",
    selectors: {
        "&:hover, &:focus-visible": {
            transform: "scale(1.08)",
            zIndex: 1,
        },
    },
});

export const mosaicCaption = style({
    position: "absolute",
    right: 0,
    bottom: 0,
    left: 0,
    padding: themeVars.spacing.half,
    background: "rgba(0, 0, 0, 0.55)",
    color: layerVars.contrast,
    fontSize: themeVars.fontSize.xSmall,
    textAlign: "center",
});
