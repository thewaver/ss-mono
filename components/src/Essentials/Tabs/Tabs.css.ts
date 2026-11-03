import { globalStyle, style } from "@vanilla-extract/css";

import type { CornerRunDirection } from "../../Abstracts/CornerRun/CornerRun.types";
import { CornerRunUtils } from "../../Abstracts/CornerRun/CornerRun.utils";

import { interactionRoot } from "../../Primitives/InteractionWrapper/InteractionWrapper.css";
import { buttonElement } from "../Buttons/Button/Button.css";

const ORIENTATION_DIRECTIONS = {
    horizontal: "row",
    vertical: "column",
} as const satisfies Record<string, CornerRunDirection>;

export const tabsRoot = style({
    position: "relative",
    isolation: "isolate",
    display: "flex",
    borderRadius: "inherit",
});

export const tabsGutter = style({
    position: "absolute",
    inset: 0,
    zIndex: -1,

    display: "grid",
    borderRadius: "inherit",
});

export const tabsItem = style([buttonElement, {}]);

globalStyle(`${tabsRoot} > ${interactionRoot}`, {
    borderRadius: 0,
});

globalStyle(`${tabsRoot} > ${interactionRoot} > *`, {
    borderRadius: "inherit",
});

(Object.keys(ORIENTATION_DIRECTIONS) as (keyof typeof ORIENTATION_DIRECTIONS)[]).forEach((orientation) => {
    const run = `${tabsRoot}[aria-orientation="${orientation}"] > ${interactionRoot}`;
    const direction = ORIENTATION_DIRECTIONS[orientation];

    globalStyle(
        `${run}:nth-child(1 of ${interactionRoot})`,
        CornerRunUtils.computeEdge(direction, "leading", "inherit"),
    );

    globalStyle(
        `${run}:nth-last-child(1 of ${interactionRoot})`,
        CornerRunUtils.computeEdge(direction, "trailing", "inherit"),
    );
});
