import { style } from "@vanilla-extract/css";

import { layerVars } from "../../StyledComponents/Layer/Layer.css";
import { themeVars } from "../../Theme.css";

export const dateTimeRow = style({
    display: "flex",
    alignItems: "center",
    gap: themeVars.spacing.half,
});

export const dateTimeSeparator = style({
    paddingInline: themeVars.spacing.half,
    color: layerVars.contrast,
    fontSize: themeVars.fontSize.small,
    opacity: 0.75,
});
