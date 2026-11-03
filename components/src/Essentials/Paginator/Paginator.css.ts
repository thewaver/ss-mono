import { globalStyle, style } from "@vanilla-extract/css";

import { CornerRunUtils } from "../../Abstracts/CornerRun/CornerRun.utils";

import { interactionRoot } from "../../Primitives/InteractionWrapper/InteractionWrapper.css";
import { buttonElement } from "../Buttons/Button/Button.css";

export const paginatorRoot = style({
    borderRadius: "inherit",
});

export const paginatorRow = style({
    display: "flex",
    alignItems: "center",
});

export const paginatorItem = style([buttonElement, {}]);

export const paginatorGap = style({
    display: "grid",
});

globalStyle(`${paginatorRoot} > ${paginatorRow}`, {
    borderRadius: "inherit",
});

globalStyle(`${paginatorRow} > *`, {
    borderRadius: 0,
});

globalStyle(`${paginatorRow} > *:first-child`, CornerRunUtils.computeEdge("row", "leading", "inherit"));

globalStyle(`${paginatorRow} > *:last-child`, CornerRunUtils.computeEdge("row", "trailing", "inherit"));

globalStyle(`${paginatorRow} > ${interactionRoot} > *`, {
    borderRadius: "inherit",
});
