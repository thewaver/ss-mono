import { style } from "@vanilla-extract/css";

import { layerVars } from "../../StyledComponents/Layer/Layer.css";
import { themeVars } from "../../Theme.css";

export const posterBox = style({
    width: "100%",
    height: 240,
    color: layerVars.contrast,
    fontWeight: "bold",
    textAlign: "center",
    textTransform: "uppercase",
});

export const stackBox = style({
    width: 160,
    height: 320,
    marginInline: "auto",
    color: themeVars.color.primary.main,
    fontFamily: "Georgia, serif",
    fontStyle: "italic",
});
