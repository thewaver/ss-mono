import { createVar, style } from "@vanilla-extract/css";

import { themeVars } from "../../Theme.css";

export const stageSize = 480;
export const paneSize = 320;

export const paneLeftVar = createVar();
export const paneTopVar = createVar();

export const colorList = style({
    display: "flex",
    flexWrap: "wrap",
    flexDirection: "row",
    justifyContent: "start",
    alignItems: "start",
    gap: themeVars.spacing.full,
});

export const stage = style({
    position: "relative",
    touchAction: "none",
    width: stageSize,
    height: stageSize,
    backgroundSize: "cover",
    backgroundPosition: "center",
    resize: "both",
    overflow: "auto",
});

export const paneHost = style({
    position: "absolute",
    left: paneLeftVar,
    top: paneTopVar,
    width: "fit-content",
    cursor: "grab",
    selectors: {
        "&[data-dragging]": {
            cursor: "grabbing",
        },
    },
});

export const paneShadow = style({
    position: "absolute",
    inset: 0,
    pointerEvents: "none",
    boxShadow: themeVars.shadow.large,
});

export const paneContent = style({
    display: "grid",
    placeItems: "center",
    width: paneSize,
    height: paneSize,
    color: "#FFFFFF",
    fontSize: themeVars.fontSize.large,
    fontWeight: "bold",
    paintOrder: "stroke fill",
    textShadow: "0 2px black",
    WebkitTextStroke: "2px black",
});
