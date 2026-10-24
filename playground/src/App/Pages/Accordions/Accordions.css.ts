import { createVar, keyframes, style } from "@vanilla-extract/css";

import { layerVars } from "../../StyledComponents/Layer/Layer.css";
import { themeVars } from "../../Theme.css";

export const textWithPanel = style({
    display: "flex",
    flexDirection: "column",
    gap: themeVars.spacing.full,
});

export const scrollBox = style({
    height: 160,
    overflowY: "auto",
});

export const ACCORDION_DOCS_MAX_WIDTH = 480;

export const docsAccordion = style({
    width: "100%",
    maxWidth: ACCORDION_DOCS_MAX_WIDTH,
});

export const growingButtons = style({
    display: "flex",
    gap: themeVars.spacing.full,
});

export const sideExample = style([
    docsAccordion,
    {
        display: "flex",
        justifyContent: "center",
    },
]);

export const ROW_HEIGHT = 200;
export const ROW_PANEL_WIDTH = 240;

const SLIDE_DISTANCE = 40;

const axisVar = createVar();
const moveVar = createVar();

const slideIn = keyframes({
    "0%": {
        opacity: 0,
        transform: `translate(calc(${moveVar} * ${axisVar} * ${SLIDE_DISTANCE}px), calc(${moveVar} * (1 - ${axisVar}) * ${SLIDE_DISTANCE}px))`,
    },
    "100%": {
        opacity: 1,
        transform: "none",
    },
});

export const orientationExample = style([
    docsAccordion,
    {
        selectors: {
            '&[data-orientation="horizontal"]': {
                vars: { [axisVar]: "1" },
            },
            '&[data-orientation="vertical"]': {
                vars: { [axisVar]: "0" },
            },
        },
    },
]);

const whenHorizontal = `${orientationExample}[data-orientation="horizontal"] &`;
const whenVertical = `${orientationExample}[data-orientation="vertical"] &`;

export const orientationStrip = style({
    display: "flex",
    alignItems: "center",
    padding: themeVars.spacing.full,
    borderRadius: themeVars.borderRadius.half,
    backgroundColor: layerVars.main,
    fontSize: themeVars.fontSize.medium,
    transition: `filter ${themeVars.animation.duration}`,

    selectors: {
        "&:hover": {
            filter: themeVars.hover.filter,
        },
        [whenHorizontal]: {
            justifyContent: "center",
            height: ROW_HEIGHT,
        },
        [whenVertical]: {
            width: "100%",
        },
    },
});

export const orientationLabel = style({
    selectors: {
        [whenHorizontal]: {
            writingMode: "vertical-rl",
            transform: "rotate(180deg)",
            whiteSpace: "nowrap",
        },
    },
});

export const isEntering = style({});

export const orientationPanel = style({
    vars: { [moveVar]: "0" },
    display: "flex",
    flexDirection: "column",
    gap: themeVars.spacing.full,
    padding: themeVars.spacing.double,
    borderRadius: themeVars.borderRadius.half,
    backgroundColor: layerVars.main,
    fontSize: themeVars.fontSize.small,

    selectors: {
        [whenHorizontal]: {
            justifyContent: "center",
            width: ROW_PANEL_WIDTH,
            height: ROW_HEIGHT,
        },
        '&[data-move="forward"]': {
            vars: { [moveVar]: "1" },
        },
        '&[data-move="backward"]': {
            vars: { [moveVar]: "-1" },
        },
        [`&.${isEntering}[data-move]`]: {
            animationName: slideIn,
            animationFillMode: "both",
        },
    },
});
