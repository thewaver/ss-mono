import { style } from "@vanilla-extract/css";

import { layerVars } from "../../../StyledComponents/Layer/Layer.css";
import { themeVars } from "../../../Theme.css";

export const stage = style({
    display: "grid",
    placeItems: "center",
    width: "100%",
    height: "100%",
});

export const photo = style({
    display: "block",
    width: 160,
    height: 160,
    borderRadius: themeVars.borderRadius.full,
    objectFit: "cover",
    userSelect: "none",
});

export const headline = style({
    color: layerVars.contrast,
    fontSize: 56,
    fontWeight: "bold",
    lineHeight: 1,
    letterSpacing: "0.04em",
    textTransform: "uppercase",
    userSelect: "none",
});
