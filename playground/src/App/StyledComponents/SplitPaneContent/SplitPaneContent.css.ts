import { style } from "@vanilla-extract/css";

import { skinEntries, skinStates } from "../../Skins/Skin.css";
import { themeVars } from "../../Theme.css";

const FRAME_MAX_WIDTH = 380;
const PICTURE_ASPECT = 1;

export const isDragging = style([skinStates.isActive]);
export const isDisabled = style({});

const gutterBase = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    transition: `background-color ${themeVars.animation.duration}, opacity ${themeVars.animation.duration}`,

    selectors: {
        [`&.${isDisabled}`]: {
            opacity: themeVars.disabled.opacity,
        },
    },
} as const;

export const rowGutter = style([skinEntries.splitPaneGutter, { ...gutterBase, width: "100%", height: "100%" }]);

export const columnGutter = style([skinEntries.splitPaneGutter, { ...gutterBase, width: "100%", height: "100%" }]);

export const gutterGrip = style([
    skinEntries.splitPaneGrip,
    {
        backgroundColor: "currentColor",
    },
]);

export const rowGrip = style([gutterGrip, { width: 2, height: 24 }]);

export const columnGrip = style([gutterGrip, { width: 24, height: 2 }]);

export const splitPaneBox = style([
    skinEntries.panel,
    {
        width: "100%",
        height: "100%",
        padding: themeVars.spacing.full,
        fontSize: themeVars.fontSize.small,
        overflow: "auto",
    },
]);

export const splitPaneFrame = style([
    skinEntries.splitPaneFrame,
    {
        width: "100%",
        maxWidth: FRAME_MAX_WIDTH,
        height: 220,
        padding: themeVars.spacing.half,
    },
]);

export const compareFrame = style([
    splitPaneFrame,
    { containerType: "inline-size", height: "auto", aspectRatio: `${PICTURE_ASPECT}` },
]);

export const compareBox = style({
    position: "relative",
    width: "100%",
    height: "100%",
    borderRadius: themeVars.borderRadius.half,
    overflow: "hidden",
});

const compareImageBase = {
    position: "absolute",
    top: 0,
    width: "100cqw",
    height: "100%",
    objectFit: "cover",
} as const;

export const compareStartImage = style({ ...compareImageBase, left: 0 });

export const compareEndImage = style({ ...compareImageBase, right: 0 });
