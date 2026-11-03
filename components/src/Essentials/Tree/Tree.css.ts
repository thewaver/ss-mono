import { globalStyle, style } from "@vanilla-extract/css";

import { CornerRunUtils } from "../../Abstracts/CornerRun/CornerRun.utils";

import { interactionRoot } from "../../Primitives/InteractionWrapper/InteractionWrapper.css";

export const treeRoot = style({
    position: "relative",
    isolation: "isolate",
    borderRadius: "inherit",
});

export const treeNode = style({
    width: "100%",
    borderRadius: "inherit",
    color: "inherit !important",
    textDecoration: "none !important",
    cursor: "pointer",
    pointerEvents: "all",

    selectors: {
        "&[aria-disabled='true']": {
            cursor: "not-allowed",
        },
    },
});

export const treeConnector = style({
    position: "absolute",
    inset: 0,
    zIndex: -2,
    pointerEvents: "none",
});

export const treeSizer = style({
    position: "relative",
    isolation: "isolate",
    width: "100%",
});

export const treeSizerRow = style({
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
});

const LEVEL = `:is(${treeRoot}, ${treeRoot} [role="group"])`;
const ITEM = `:is(${interactionRoot}, [role="group"])`;

globalStyle(`${LEVEL} > ${ITEM}`, {
    borderRadius: 0,
});

globalStyle(`${LEVEL} > ${ITEM}:nth-child(1 of ${ITEM})`, CornerRunUtils.computeEdge("column", "leading", "inherit"));

globalStyle(
    `${LEVEL} > ${ITEM}:nth-last-child(1 of ${ITEM})`,
    CornerRunUtils.computeEdge("column", "trailing", "inherit"),
);
