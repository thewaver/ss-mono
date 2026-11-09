import { globalStyle, style, styleVariants } from "@vanilla-extract/css";

import type { CornerRunDirection } from "../../../Abstracts/CornerRun/CornerRun.types";
import { CornerRunUtils } from "../../../Abstracts/CornerRun/CornerRun.utils";

import { collapsibleRoot } from "../Collapsible/Collapsible.css";

export const accordionSizingVariants = styleVariants({
    "fit-content": {
        width: "fit-content",
    },
    "fill": {
        width: "100%",
    },
});

export const accordionRoot = style({
    display: "flex",
    borderRadius: "inherit",
});

const ORIENTATION_DIRECTIONS = {
    horizontal: "row",
    vertical: "column",
} as const satisfies Record<string, CornerRunDirection>;

export const accordionOrientationVariants = styleVariants({
    horizontal: {
        flexDirection: "row",
        alignItems: "stretch",
    },
    vertical: {
        flexDirection: "column",
    },
});

globalStyle(`${accordionRoot} > ${collapsibleRoot}`, {
    borderRadius: 0,
});

globalStyle(`${accordionOrientationVariants.horizontal} > ${collapsibleRoot}`, {
    gridTemplateColumns: "auto",
});

(Object.keys(ORIENTATION_DIRECTIONS) as (keyof typeof ORIENTATION_DIRECTIONS)[]).forEach((orientation) => {
    const orientationClass = accordionOrientationVariants[orientation];
    const direction = ORIENTATION_DIRECTIONS[orientation];

    globalStyle(
        `${orientationClass} > ${collapsibleRoot}:first-child`,
        CornerRunUtils.computeEdge(direction, "leading", "inherit"),
    );

    globalStyle(
        `${orientationClass} > ${collapsibleRoot}:last-child`,
        CornerRunUtils.computeEdge(direction, "trailing", "inherit"),
    );
});
