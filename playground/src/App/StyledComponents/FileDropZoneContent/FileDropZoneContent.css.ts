import { style } from "@vanilla-extract/css";

import { skinEntries, skinStates } from "../../Skins/Skin.css";
import { themeVars } from "../../Theme.css";
import { layerVars } from "../Layer/Layer.css";

const ZONE_WIDTH = 320;
const ZONE_HEIGHT = 120;

export const isHovered = style([skinStates.isHovered]);
export const isDragOver = style([skinStates.isReceiving]);
export const isEmpty = style({});
export const isDisabled = style([skinStates.isDisabled]);
export const hasError = style([skinStates.hasError]);

export const fileDropZoneContent = style([
    skinEntries.dropZone,
    {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: themeVars.spacing.half,
        boxSizing: "border-box",
        width: ZONE_WIDTH,
        height: ZONE_HEIGHT,
        padding: themeVars.spacing.full,
        fontSize: themeVars.fontSize.medium,
        textAlign: "center",
        transition: `filter ${themeVars.animation.duration}, opacity ${themeVars.animation.duration}, border-color ${themeVars.animation.duration}, background-color ${themeVars.animation.duration}`,
    },
]);

export const fileDropZonePrompt = style({
    fontWeight: "bold",
});

export const fileDropZoneNames = style({
    maxWidth: "100%",
    overflow: "hidden",
    whiteSpace: "nowrap",
    textOverflow: "ellipsis",
    fontSize: themeVars.fontSize.small,

    selectors: {
        [`&.${isEmpty}`]: {
            color: `rgb(from ${layerVars.contrast} r g b / 50%)`,
            fontStyle: "italic",
        },
    },
});
