import { globalStyle, style } from "@vanilla-extract/css";

import { buttonElement } from "../../../Essentials/Buttons/Button/Button.css";
import { spineFace } from "../../../Primitives/Spine/Spine.css";

export const flipbookRoot = style({
    display: "flex",
    flexDirection: "column",
    width: "100%",
    height: "100%",
});

export const flipbookBook = style({
    position: "relative",
    flexGrow: 1,
    minHeight: 0,
});

export const flipbookPage = style({
    position: "absolute",
    top: 0,
    bottom: 0,
    width: "50%",
    display: "grid",
    pointerEvents: "auto",
});

export const flipbookPageFront = style({
    left: "50%",
});

export const flipbookPageBack = style({
    left: 0,
});

export const flipbookControl = style([buttonElement, {}]);

globalStyle(`${flipbookBook} ${spineFace}`, {
    pointerEvents: "none",
});
