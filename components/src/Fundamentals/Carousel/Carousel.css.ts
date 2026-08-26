import { style } from "@vanilla-extract/css";

import { buttonElement } from "../Button/Button.css";

export const carouselRoot = style({
    display: "flex",
    flexDirection: "column",
});

export const carouselViewport = style({
    position: "relative",
    flexGrow: 1,
    minHeight: 0,
    overflow: "hidden",
});

export const carouselStage = style({
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
});

export const carouselTrack = style({
    display: "flex",
    transitionProperty: "transform",
});

export const carouselSlide = style({
    flex: "0 0 100%",
    minWidth: 0,
    minHeight: 0,
});

export const carouselControl = style([buttonElement, {}]);
