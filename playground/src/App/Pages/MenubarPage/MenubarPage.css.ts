import { style } from "@vanilla-extract/css";

import { layerVars } from "../../StyledComponents/Layer/Layer.css";
import { themeVars } from "../../Theme.css";

export const bar = style({
    display: "flex",
    alignItems: "center",
    maxWidth: "100%",
    padding: themeVars.spacing.half,
    borderRadius: themeVars.borderRadius.full,
    backgroundColor: layerVars.main,
});
