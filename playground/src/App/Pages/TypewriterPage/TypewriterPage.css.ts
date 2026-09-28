import { keyframes, style } from "@vanilla-extract/css";

import { themeVars } from "../../Theme.css";

export const typewriterFade = keyframes({
    "0%": {
        opacity: 0,
    },
    "100%": {
        opacity: 1,
    },
});

export const typewriterScale = keyframes({
    "0%": {
        opacity: 0,
        transform: "scale(2)",
    },
    "25%": {
        opacity: 1,
        transform: "scale(2)",
    },
    "100%": {
        opacity: 1,
        transform: "scale(1)",
    },
});

export const typewriterGlow = keyframes({
    "0%": {
        opacity: 0,
        filter: "saturate(0) brightness(4)",
    },
    "25%": {
        opacity: 1,
        filter: "saturate(0) brightness(4)",
    },
    "100%": {
        opacity: 1,
        filter: "saturate(1) brightness(1)",
    },
});

export const typewriterDrop = keyframes({
    "0%": {
        opacity: 0,
        transform: "translateY(-240px)",
    },
    "25%": {
        opacity: 1,
        transform: "translateY(-240px)",
    },
    "100%": {
        opacity: 1,
        transform: "translateY(0)",
    },
});

export const typewriterSlide = keyframes({
    "0%": {
        opacity: 0,
        transform: "translateX(240px)",
    },
    "25%": {
        opacity: 1,
        transform: "translateX(240px)",
    },
    "100%": {
        opacity: 1,
        transform: "translateX(0)",
    },
});

export const root = style({
    display: "flex",
    flexDirection: "column",
    justifyContent: "start",
    alignItems: "start",
    gap: themeVars.spacing.quad,
});

export const textHighlight = style({
    textTransform: "uppercase",
    lineHeight: 2,
    paintOrder: "stroke fill",
    WebkitTextStroke: "4px black",
});

export const typewriterCaretBlink = keyframes({
    "0%": {
        opacity: 1,
    },
    "50%": {
        opacity: 0,
    },
});

export const phraseStack = style({
    display: "flex",
    flexDirection: "column",
    gap: themeVars.spacing.full,
    alignItems: "flex-start",
});

export const phraseLine = style({
    alignSelf: "stretch",
    display: "flex",
    alignItems: "baseline",
    gap: themeVars.spacing.half,
    fontSize: themeVars.fontSize.large,
});

export const phraseSlot = style({
    flex: 1,
    minWidth: 0,
});

export const phraseCaret = style({
    display: "inline-block",
    width: "2px",
    height: "1em",
    marginLeft: "1px",
    verticalAlign: "text-bottom",
    background: "currentColor",
});

export const phraseCaretBlinking = style({
    animationName: typewriterCaretBlink,
    animationDuration: "1s",
    animationTimingFunction: "steps(1)",
    animationIterationCount: "infinite",
});
