import { globalStyle, style } from "@vanilla-extract/css";

export const mosaicRoot = style({
    position: "relative",
});

export const mosaicItem = style({
    position: "absolute",
});

export const mosaicSizedItem = style({
    display: "grid",
});

globalStyle(`${mosaicSizedItem} > *`, {
    gridArea: "1 / 1",
});

export const mosaicTileButton = style({
    display: "grid",
});

globalStyle(`${mosaicTileButton} > *`, {
    gridArea: "1 / 1",
});
