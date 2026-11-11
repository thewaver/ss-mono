import { createVar, keyframes, style, styleVariants } from "@vanilla-extract/css";

import { skinEntries } from "../../Skins/Skin.css";
import { themeVars } from "../../Theme.css";

const countdown = keyframes({
    "0%": { width: "100%" },
    "100%": { width: "0%" },
});

export const toastCard = style([
    skinEntries.surface,
    {
        position: "relative",
        overflow: "hidden",

        display: "flex",
        alignItems: "center",
        gap: themeVars.spacing.full,
        width: 300,
        padding: themeVars.spacing.full,
    },
]);

const kindColorVar = createVar();

export const toastKindVariants = styleVariants({
    info: { vars: { [kindColorVar]: themeVars.color.info.main } },
    success: { vars: { [kindColorVar]: themeVars.color.success.main } },
    error: { vars: { [kindColorVar]: themeVars.color.error.main } },
});

export const toastAnimationOffVariants = styleVariants({
    zoom: { transform: "scale(0.75)", opacity: 0 },
    slide: { transform: "translateX(120%)", opacity: 0 },
    fade: { opacity: 0 },
});

export const toastAnimationOn = style({
    transform: "none",
    opacity: 1,
});

export const toastBody = style({
    display: "flex",
    flexDirection: "column",
    gap: themeVars.spacing.half,
    flexGrow: 1,
});

export const toastMessage = style({
    fontSize: themeVars.fontSize.small,
});

export const toastMeta = style({
    fontSize: themeVars.fontSize.xSmall,
    fontVariantNumeric: "tabular-nums",
    opacity: 0.5,
});

export const toastCountdown = style({
    position: "absolute",
    bottom: 0,
    insetInlineStart: 0,

    height: 2,
    backgroundColor: kindColorVar,
    animationName: countdown,
    animationTimingFunction: "linear",
    animationFillMode: "forwards",
});
