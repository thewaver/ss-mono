import { style } from "@vanilla-extract/css";

import { lookEntries, lookStates } from "../../Looks/Look.css";
import { themeVars } from "../../Theme.css";
import { layerVars } from "../Layer/Layer.css";

export const isSelected = style([lookStates.isSelected]);
export const isHovered = style([lookStates.isHovered]);
export const isDisabled = style([lookStates.isDisabled]);
export const isVisible = style({});

const tabBase = style({
    whiteSpace: "nowrap",
    transition: `color ${themeVars.animation.duration}, opacity ${themeVars.animation.duration}`,
});

export const rowTab = style([
    lookEntries.tabsItem,
    tabBase,
    {
        marginBlockEnd: themeVars.spacing.half,
    },
]);

export const columnTab = style([
    lookEntries.tabsItem,
    lookStates.isVertical,
    tabBase,
    {
        textAlign: "start",
    },
]);

export const rowTabGutter = style([lookEntries.tabsGutter]);

export const columnTabGutter = style([lookEntries.tabsGutter, lookStates.isVertical]);

export const rowTabFloater = style([
    lookEntries.tabsFloater,
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
    lookEntries.tabsFloater,
    lookStates.isVertical,
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

export const tabPanel = style([
    lookEntries.panel,
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
    lookEntries.hoverFloater,
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
