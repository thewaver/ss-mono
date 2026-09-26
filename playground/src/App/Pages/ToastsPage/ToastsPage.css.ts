import { style } from "@vanilla-extract/css";

import { layerVars } from "../../StyledComponents/Layer/Layer.css";
import { themeVars } from "../../Theme.css";

export const root = style({
    display: "flex",
    flexDirection: "column",
    justifyContent: "start",
    alignItems: "start",
    gap: themeVars.spacing.quad,
});

export const raiseRow = style({
    display: "flex",
    alignItems: "center",
    gap: themeVars.spacing.full,
});

export const note = style({
    maxWidth: 640,
    color: layerVars.contrast,
    fontSize: themeVars.fontSize.small,
    opacity: 0.75,
});
