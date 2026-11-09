import { style } from "@vanilla-extract/css";

import { skinEntries, skinStates } from "../../Skins/Skin.css";
import { themeVars } from "../../Theme.css";
import { layerVars } from "../Layer/Layer.css";

export const isCarried = style({});
export const isHovered = style({});
const disabled = style({});
export const isDisabled = style([disabled, skinStates.isDisabled]);
export const isReceiving = style([skinStates.isReceiving]);
export const isCarrying = style([skinStates.isCarrying]);

export const sortableItemContent = style([
    skinEntries.itemStatic,
    {
        display: "flex",
        alignItems: "center",
        gap: themeVars.spacing.full,
        padding: themeVars.spacing.full,
        fontSize: themeVars.fontSize.medium,
        whiteSpace: "nowrap",
        cursor: "grab",
        transition: `opacity ${themeVars.animation.duration}, border-color ${themeVars.animation.duration}, background-color ${themeVars.animation.duration}`,

        selectors: {
            [`&.${isHovered}`]: {
                borderColor: `rgb(from ${layerVars.contrast} r g b / 50%)`,
            },
            [`&.${isCarried}`]: {
                borderColor: themeVars.color.primary.main,
                backgroundColor: "transparent",
                color: `rgb(from ${layerVars.contrast} r g b / 50%)`,
                boxShadow: "none",
                cursor: "grabbing",
            },
            [`&.${disabled}`]: {
                filter: themeVars.disabled.filter,
                opacity: themeVars.disabled.opacity,
                cursor: "default",
            },
        },
    },
]);

export const sortableItemGrip = style({
    fontSize: themeVars.fontSize.medium,
    opacity: 0.5,
});

export const sortableItemDetail = style({
    marginInlineStart: "auto",
    paddingInlineStart: themeVars.spacing.full,
    fontSize: themeVars.fontSize.small,
    opacity: 0.75,
});

export const sortableSurface = style([
    skinEntries.dropZone,
    {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        position: "absolute",
        inset: `calc(-1 * ${themeVars.spacing.full})`,
        zIndex: -1,
        pointerEvents: "none",
        transition: `border-color ${themeVars.animation.duration}, background-color ${themeVars.animation.duration}`,
    },
]);

export const sortableEmpty = style({
    fontSize: themeVars.fontSize.small,
    fontStyle: "italic",
    opacity: 0.5,
});

const sortableMarker = style({
    alignSelf: "stretch",
    borderRadius: themeVars.borderRadius.half,
    backgroundColor: themeVars.color.primary.main,
});

export const sortableMarkerRow = style([sortableMarker, { width: 3 }]);

export const sortableMarkerColumn = style([sortableMarker, { height: 3 }]);

export const sortableItemCentered = style({
    maxWidth: "100%",
    marginInline: "auto",
    whiteSpace: "normal",
});

export const sortableRingMarker = style({
    width: 4,
    height: "70%",
    borderRadius: themeVars.borderRadius.half,
    backgroundColor: themeVars.color.primary.main,
    boxShadow: themeVars.shadow.small,
});

export const sortableRoom = style({
    padding: themeVars.spacing.full,
    minWidth: 0,
});
