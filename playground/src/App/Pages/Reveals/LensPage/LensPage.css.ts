import { globalStyle, style } from "@vanilla-extract/css";

import { layerVars } from "../../../StyledComponents/Layer/Layer.css";
import { FOCUS_RING_WIDTH, themeVars } from "../../../Theme.css";

export const root = style({
    borderRadius: themeVars.borderRadius.full,
    overflow: "hidden",
    selectors: {
        "&:has(> :focus-visible)": {
            outline: `${FOCUS_RING_WIDTH}px solid ${themeVars.color.outline.main}`,
        },
    },
});

globalStyle(`${root} > :focus-visible`, {
    outline: "0 none",
});

export const photo = style({
    display: "block",
    width: "100%",
    height: 260,
    objectFit: "cover",
    userSelect: "none",
});

export const print = style({
    display: "flex",
    flexDirection: "column",
    gap: themeVars.spacing.half,
    height: 260,
    padding: themeVars.spacing.double,
    backgroundColor: layerVars.main,
    color: layerVars.contrast,
    fontSize: themeVars.fontSize.small,
    userSelect: "none",
});

export const printTitle = style({
    color: themeVars.color.primary.main,
    fontSize: themeVars.fontSize.large,
});

export const finePrint = style({
    fontSize: themeVars.fontSize.xSmall,
});
