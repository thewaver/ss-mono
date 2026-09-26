import { style } from "@vanilla-extract/css";

import { themeVars } from "../../Theme.css";

export const playbackRow = style({
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: themeVars.spacing.full,
});

export const sliderSlot = style({
    flex: 1,
    minWidth: 0,
});

export const playbackIcon = style({
    display: "block",
    width: 16,
    height: 16,
    fill: "currentColor",
});
