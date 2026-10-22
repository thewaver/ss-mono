import { style } from "@vanilla-extract/css";

import { buttonElement } from "../Buttons/Button/Button.css";

export const paginatorRow = style({
    display: "flex",
    alignItems: "center",
});

export const paginatorItem = style([buttonElement, {}]);

export const paginatorGap = style({
    display: "grid",
});
