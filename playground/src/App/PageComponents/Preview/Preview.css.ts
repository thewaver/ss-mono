import { globalStyle, style } from "@vanilla-extract/css";

export const PREVIEW_WIDTH = 600;
export const PREVIEW_MIN_HEIGHT = 400;
export const PREVIEW_PADDING = 40;

export const previewContent = style({
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    width: "100%",
    height: "100%",
    padding: PREVIEW_PADDING,
    boxSizing: "border-box",
});

export const previewBody = style({
    display: "flex",
    flexDirection: "column",
    alignItems: "stretch",
});

globalStyle(`${previewBody} > div, ${previewBody} [data-demo]`, {
    alignItems: "center",
});
