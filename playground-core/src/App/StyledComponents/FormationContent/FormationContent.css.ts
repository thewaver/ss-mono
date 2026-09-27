import { style } from "@vanilla-extract/css";

import { themeVars } from "../../Theme.css";
import { layerVars } from "../Layer/Layer.css";

export const formationItem = style({
    display: "grid",
    width: "100%",
    height: "100%",
});

export const formationItemContent = style({
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "100%",
    color: layerVars.contrast,
    fontSize: themeVars.fontSize.small,
    textAlign: "center",
    overflow: "hidden",
});

export const formationItemRank = style({
    fontSize: themeVars.fontSize.large,
    color: themeVars.color.primary.main,
});
