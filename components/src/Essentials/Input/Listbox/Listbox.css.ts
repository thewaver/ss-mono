import { globalStyle, style } from "@vanilla-extract/css";

import { CornerRunUtils } from "../../../Abstracts/CornerRun/CornerRun.utils";

import { floater } from "../../../Abstracts/Floater/Floater.css";

export const listboxRoot = style({
    borderRadius: "inherit",
});

export const listboxOptions = style({
    position: "relative",
    isolation: "isolate",
    borderRadius: "inherit",
});

export const listboxHorizontal = style({
    display: "flex",
    flexWrap: "wrap",
});

export const listboxEndMarker = style({
    width: "100%",
    height: 1,
    marginTop: -1,
});

export const listboxSizer = style({
    position: "relative",
    isolation: "isolate",
    width: "100%",
});

export const listboxSizerRow = style({
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
});

export const listboxOption = style({
    width: "100%",
    borderRadius: "inherit",
    cursor: "pointer",
    pointerEvents: "all",

    selectors: {
        "&[aria-disabled='true']": {
            cursor: "not-allowed",
        },
    },
});

const STACKED_OPTIONS = `${listboxOptions}:not(${listboxHorizontal})`;
const LEVEL = `:is(${STACKED_OPTIONS}, ${STACKED_OPTIONS} [role="group"])`;
const ITEM = `:not(${floater}, ${listboxEndMarker})`;

globalStyle(`:where(${LEVEL} > ${ITEM})`, {
    borderRadius: 0,
});

globalStyle(
    `:where(${LEVEL} > ${ITEM}:nth-child(1 of ${ITEM}))`,
    CornerRunUtils.computeEdge("column", "leading", "inherit"),
);

globalStyle(
    `:where(${LEVEL} > ${ITEM}:nth-last-child(1 of ${ITEM}))`,
    CornerRunUtils.computeEdge("column", "trailing", "inherit"),
);
