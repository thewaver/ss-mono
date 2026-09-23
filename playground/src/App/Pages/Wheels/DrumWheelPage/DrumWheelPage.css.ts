import { style } from "@vanilla-extract/css";

import { themeVars } from "../../../Theme.css";

export const reelRow = style({
    display: "flex",
    gap: themeVars.spacing.double,
});
