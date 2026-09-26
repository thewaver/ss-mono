import { style } from "@vanilla-extract/css";

import { layerVars } from "../../StyledComponents/Layer/Layer.css";
import { themeVars } from "../../Theme.css";

export const dateRangeRow = style({
    display: "flex",
    alignItems: "center",
    gap: themeVars.spacing.half,
});

export const dateRangeSeparator = style({
    color: layerVars.contrast,
    fontSize: themeVars.fontSize.small,
    opacity: 0.75,
});
