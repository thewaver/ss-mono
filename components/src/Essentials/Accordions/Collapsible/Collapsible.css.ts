import { globalStyle, style, styleVariants } from "@vanilla-extract/css";

import type { CornerRunDirection } from "../../../Abstracts/CornerRun/CornerRun.types";
import { CornerRunUtils } from "../../../Abstracts/CornerRun/CornerRun.utils";

import { interactionRoot } from "../../../Primitives/InteractionWrapper/InteractionWrapper.css";
import { buttonCursor } from "../../Buttons/Button/Button.css";

export const collapsibleSizingVariants = styleVariants({
    "fit-content": {
        width: "fit-content",
    },
    "fill": {
        width: "100%",
    },
});

export const collapsibleRoot = style({
    display: "flex",
    borderRadius: "inherit",
});

const SIDE_DIRECTIONS = {
    top: "column-reverse",
    right: "row",
    bottom: "column",
    left: "row-reverse",
} as const satisfies Record<string, CornerRunDirection>;

export const collapsibleSideVariants = styleVariants(SIDE_DIRECTIONS, (direction) => ({ flexDirection: direction }));

export const collapsibleSidewaysContent = style({
    width: "max-content",
    height: "100%",
});

export const collapsibleTrigger = style([
    buttonCursor,
    {
        display: "flex",
        pointerEvents: "all",
        width: "100%",
        border: "none",
        borderRadius: "inherit",
        padding: 0,
        background: "none",
        font: "inherit",
        color: "inherit",
        textAlign: "inherit",
    },
]);

export const collapsibleHeading = style({
    margin: 0,
    borderRadius: "inherit",
    font: "inherit",
    color: "inherit",
});

export const collapsiblePanel = style({
    overflow: "hidden",
    borderRadius: "inherit",
});

globalStyle(
    `${collapsibleRoot} > ${interactionRoot}, ${collapsibleHeading} > ${interactionRoot}, ${collapsiblePanel} > *`,
    {
        borderRadius: "inherit",
    },
);

(Object.keys(SIDE_DIRECTIONS) as (keyof typeof SIDE_DIRECTIONS)[]).forEach((side) => {
    const sideClass = collapsibleSideVariants[side];
    const direction = SIDE_DIRECTIONS[side];

    globalStyle(
        `${sideClass} > ${interactionRoot} > ${collapsibleTrigger}[aria-expanded="true"], ${sideClass} > ${collapsibleHeading} > ${interactionRoot} > ${collapsibleTrigger}[aria-expanded="true"]`,
        CornerRunUtils.computeEdge(direction, "trailing", 0),
    );

    globalStyle(`${sideClass} > ${collapsiblePanel}`, CornerRunUtils.computeEdge(direction, "leading", 0));
});
