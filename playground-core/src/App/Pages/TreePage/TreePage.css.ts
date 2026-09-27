import { style } from "@vanilla-extract/css";

import { layerVars } from "../../StyledComponents/Layer/Layer.css";

export const treeScroller = style({
    overflowY: "auto",
    maxHeight: 320,
    width: "100%",
});

export const rankStage = style({
    display: "grid",
    position: "relative",
    placeItems: "center",
});

export const rankRing = style({
    position: "absolute",
    top: "50%",
    left: "50%",
    borderRadius: "50%",
    border: `1px dashed rgb(from ${layerVars.contrast} r g b / 25%)`,
    transform: "translate(-50%, -50%)",
    pointerEvents: "none",
});
