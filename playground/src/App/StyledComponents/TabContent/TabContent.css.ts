import { style } from "@vanilla-extract/css";

import { skinEntries, skinStates } from "../../Skins/Skin.css";
import { themeVars } from "../../Theme.css";
import { layerVars } from "../Layer/Layer.css";

export const isSelected = style([skinStates.isSelected]);
export const isHovered = style([skinStates.isHovered]);
export const isDisabled = style([skinStates.isDisabled]);
export const hasHoverFloater = style([skinStates.hasHoverFloater]);
export const hasSelectionFloater = style([skinStates.hasSelectionFloater]);
export const isVisible = style({});

const tabBase = style({
    whiteSpace: "nowrap",
    transition: `color ${themeVars.animation.duration}, opacity ${themeVars.animation.duration}`,
});

export const rowTab = style([
    skinEntries.tabsItemBase,
    tabBase,
    {
        marginBlockEnd: 0,
    },
]);

export const columnTab = style([
    skinEntries.tabsItemBase,
    skinStates.isVertical,
    tabBase,
    {
        textAlign: "start",
    },
]);

export const rowTabGutter = style([skinEntries.tabsTrack]);

export const columnTabGutter = style([skinEntries.tabsTrack, skinStates.isVertical]);

export const rowTabFloater = style([
    skinEntries.tabsItemSelectionFloater,
    {
        transform: "scaleX(0)",
        transition: "transform",

        selectors: {
            [`&.${isVisible}`]: {
                transform: "scaleX(1)",
            },
        },
    },
]);

export const columnTabFloater = style([
    skinEntries.tabsItemSelectionFloater,
    skinStates.isVertical,
    {
        width: "100%",
        height: "100%",
        opacity: 0,
        transition: "opacity",

        selectors: {
            [`&.${isVisible}`]: {
                opacity: 1,
            },
        },
    },
]);

const tabHighlightFloaterBase = style({
    width: "100%",
    height: "100%",
    opacity: 0,
    transitionProperty: "opacity",

    selectors: {
        [`&.${isVisible}`]: {
            opacity: 1,
        },
    },
});

export const rowTabHighlightFloater = style([skinEntries.tabsItemHoverFloater, tabHighlightFloaterBase]);

export const columnTabHighlightFloater = style([
    skinEntries.tabsItemHoverFloater,
    skinStates.isVertical,
    tabHighlightFloaterBase,
]);

export const tabPanel = style([
    skinEntries.panel,
    {
        padding: themeVars.spacing.full,
        fontSize: themeVars.fontSize.small,
    },
]);

const HEX_CLIP = "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)";

export const hexTab = style([
    tabBase,
    {
        display: "grid",
        placeItems: "center",
        width: "100%",
        height: "100%",
        backgroundColor: `rgb(from ${layerVars.contrast} r g b / 10%)`,
        fontSize: themeVars.fontSize.xSmall,
        fontWeight: "bold",
        transition: `color ${themeVars.animation.duration}, background-color ${themeVars.animation.duration}, opacity ${themeVars.animation.duration}`,

        selectors: {
            [`&.${isHovered}`]: {
                color: themeVars.color.primary.main,
            },
            [`&.${isSelected}`]: {
                color: themeVars.color.primary.contrast,
                backgroundColor: "transparent",
            },
            [`&.${isDisabled}`]: {
                opacity: themeVars.disabled.opacity,
                filter: themeVars.disabled.filter,
            },
        },
    },
]);

export const hexTabHighlightFloater = style([
    skinEntries.itemHoverFloater,
    {
        width: "100%",
        height: "100%",
        clipPath: HEX_CLIP,
        opacity: 0,
        transitionProperty: "opacity",

        selectors: {
            [`&.${isVisible}`]: {
                opacity: 1,
            },
        },
    },
]);

export const hexTabFloater = style({
    width: "100%",
    height: "100%",
    clipPath: HEX_CLIP,
    backgroundColor: themeVars.color.primary.light,
    backgroundImage: `linear-gradient(215deg, ${themeVars.color.primary.light}, ${themeVars.color.primary.dark})`,
    opacity: 0,
    transitionProperty: "opacity",

    selectors: {
        [`&.${isVisible}`]: {
            opacity: 1,
        },
    },
});
