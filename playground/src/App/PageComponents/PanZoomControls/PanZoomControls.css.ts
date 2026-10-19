import { style } from "@vanilla-extract/css";

import { themeVars } from "../../Theme.css";

export const panZoomControls = style({
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: themeVars.spacing.half,
});
