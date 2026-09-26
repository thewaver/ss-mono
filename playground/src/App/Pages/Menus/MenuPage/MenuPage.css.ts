import { style } from "@vanilla-extract/css";

import { layerVars } from "../../../StyledComponents/Layer/Layer.css";
import { themeVars } from "../../../Theme.css";

export const contextRegion = style({
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: 120,
    padding: themeVars.spacing.double,
    color: layerVars.contrast,
    border: `1px dashed currentColor`,
    borderRadius: themeVars.borderRadius.full,
    fontSize: themeVars.fontSize.small,
    textAlign: "center",
});
