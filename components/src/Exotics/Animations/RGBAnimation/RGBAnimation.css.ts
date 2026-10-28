import { createVar, style } from "@vanilla-extract/css";

export const rgbAnimationRoot = style({
    position: "relative",
    width: "100%",
    height: "100%",
});

export const rgbAnimationAnchor = style({
    position: "absolute",
    opacity: 0,
});

export const rgbAnimationFilterHost = style({
    position: "absolute",
    width: 0,
    height: 0,
    overflow: "hidden",
});

export const channelSrcVar = createVar();

export const rgbAnimationContainer = style({
    position: "relative",
    isolation: "isolate",
});

export const rgbAnimationChannel = style({
    position: "absolute",
    inset: 0,
    transformOrigin: "center center",
});

export const rgbAnimationChannelPicture = style({
    position: "absolute",
    inset: 0,
    backgroundImage: channelSrcVar,
    backgroundSize: "100% 100%",
    backgroundRepeat: "no-repeat",
});
