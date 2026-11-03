import { globalStyle, style } from "@vanilla-extract/css";

import { CornerRunUtils } from "../../Abstracts/CornerRun/CornerRun.utils";

export const splitPaneRoot = style({
    display: "grid",
    width: "100%",
    height: "100%",
    borderRadius: "inherit",
});

export const splitPanePane = style({
    minWidth: 0,
    minHeight: 0,
    overflow: "hidden",
    borderRadius: 0,
});

export const splitPaneGutter = style({
    display: "grid",
    padding: 0,
    border: "0 none",
    background: "none",
    color: "inherit",
    font: "inherit",
    touchAction: "none",

    selectors: {
        '&[aria-orientation="vertical"]': {
            cursor: "col-resize",
        },
        '&[aria-orientation="horizontal"]': {
            cursor: "row-resize",
        },
        "&[aria-disabled='true']": {
            cursor: "not-allowed",
        },
    },
});

const ROW_RUN = `${splitPaneRoot}:has(> ${splitPaneGutter}[aria-orientation="vertical"])`;
const COLUMN_RUN = `${splitPaneRoot}:not(:has(> ${splitPaneGutter}[aria-orientation="vertical"]))`;

[
    { run: ROW_RUN, direction: "row" as const },
    { run: COLUMN_RUN, direction: "column" as const },
].forEach(({ run, direction }) => {
    globalStyle(
        `${run} > ${splitPanePane}:nth-child(1 of ${splitPanePane})`,
        CornerRunUtils.computeEdge(direction, "leading", "inherit"),
    );

    globalStyle(
        `${run} > ${splitPanePane}:nth-last-child(1 of ${splitPanePane})`,
        CornerRunUtils.computeEdge(direction, "trailing", "inherit"),
    );
});
