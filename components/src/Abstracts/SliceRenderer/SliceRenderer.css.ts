import { createVar, style } from "@vanilla-extract/css";

export const pictureSrcVar = createVar();
export const pictureTintVar = createVar();

export const sliceRendererCanvas = style({
    position: "absolute",
    display: "block",
    pointerEvents: "none",
});

export const sliceRendererPicture = style({
    position: "absolute",
    inset: 0,
    backgroundImage: pictureSrcVar,
    backgroundSize: "100% 100%",
    backgroundRepeat: "no-repeat",
});

export const sliceRendererPictureTinted = style({
    backgroundColor: pictureTintVar,
    backgroundBlendMode: "multiply",
    maskImage: pictureSrcVar,
    maskSize: "100% 100%",
    maskRepeat: "no-repeat",
});
