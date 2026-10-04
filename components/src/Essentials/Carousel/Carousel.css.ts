import { style } from "@vanilla-extract/css";

import { buttonElement } from "../Buttons/Button/Button.css";

export const carouselRoot = style({
    display: "flex",
    flexDirection: "column",
});

export const carouselViewport = style({
    position: "relative",
    isolation: "isolate",
    display: "grid",
    flexGrow: 1,
    minHeight: 0,
    overflow: "hidden",
});

export const carouselSlide = style({
    display: "grid",
    gridArea: "1 / 1",
    minWidth: 0,
    minHeight: 0,
    transformStyle: "preserve-3d",
});

export const carouselFace = style({
    display: "grid",
    gridArea: "1 / 1",
    minWidth: 0,
    minHeight: 0,
});

export const carouselFaceTurnable = style({
    backfaceVisibility: "hidden",
});

export const carouselControl = style([buttonElement, {}]);
