import { style } from "@vanilla-extract/css";

export const morphTextRoot = style({
    display: "grid",
});

export const morphTextCopy = style({
    gridArea: "1 / 1",
});

export const morphTextFilterHost = style({
    position: "absolute",
    width: 0,
    height: 0,
    overflow: "hidden",
});
