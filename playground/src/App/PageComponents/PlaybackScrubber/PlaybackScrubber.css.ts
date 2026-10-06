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
