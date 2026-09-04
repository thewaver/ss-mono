import { style } from "@vanilla-extract/css";

import { themeVars } from "../../Theme.css";

export const isCarried = style({});
export const isHovered = style({});
export const isDisabled = style({});
export const isReceiving = style({});
export const isCarrying = style({});

export const sortableItemContent = style({
    display: "flex",
    alignItems: "center",
    gap: themeVars.spacing.full,
    padding: themeVars.spacing.full,
    border: `1px solid rgb(from currentColor r g b / 25%)`,
    borderRadius: themeVars.borderRadius.half,
    backgroundColor: themeVars.color.surface.dark,
    fontSize: themeVars.fontSize.medium,
    lineHeight: 1.25,
    whiteSpace: "nowrap",
    cursor: "grab",
    transition: `opacity ${themeVars.animation.duration}, border-color ${themeVars.animation.duration}, background-color ${themeVars.animation.duration}`,

    selectors: {
        [`&.${isHovered}`]: {
            borderColor: `rgb(from currentColor r g b / 50%)`,
        },
        [`&.${isCarried}`]: {
            borderStyle: "dashed",
            borderColor: themeVars.color.primary.main,
            backgroundColor: "transparent",
            color: `rgb(from currentColor r g b / 50%)`,
            boxShadow: "none",
            cursor: "grabbing",
        },
        [`&.${isDisabled}`]: {
            filter: themeVars.disabled.filter,
            opacity: themeVars.disabled.opacity,
            cursor: "default",
        },
    },
});

export const sortableItemGrip = style({
    fontSize: themeVars.fontSize.medium,
    opacity: 0.5,
});

export const sortableItemDetail = style({
    marginLeft: "auto",
    paddingLeft: themeVars.spacing.full,
    fontSize: themeVars.fontSize.small,
    opacity: 0.75,
});

export const sortableSurface = style({
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    inset: `calc(-1 * ${themeVars.spacing.full})`,
    zIndex: -1,
    border: `1px dashed rgb(from currentColor r g b / 25%)`,
    borderRadius: themeVars.borderRadius.full,
    pointerEvents: "none",
    transition: `border-color ${themeVars.animation.duration}, background-color ${themeVars.animation.duration}`,

    selectors: {
        [`&.${isCarrying}`]: {
            borderColor: `rgb(from currentColor r g b / 50%)`,
        },
        [`&.${isReceiving}`]: {
            borderColor: themeVars.color.primary.main,
            backgroundColor: `rgb(from ${themeVars.color.primary.main} r g b / 10%)`,
        },
        [`&.${isDisabled}`]: {
            filter: themeVars.disabled.filter,
            opacity: themeVars.disabled.opacity,
        },
    },
});

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
