import { globalStyle, style } from "@vanilla-extract/css";

import { CornerRunUtils } from "../../../Abstracts/CornerRun/CornerRun.utils";

import { floater } from "../../../Abstracts/Floater/Floater.css";
import { buttonElement } from "../../Buttons/Button/Button.css";

export const menuTrigger = style([buttonElement, {}]);

export const menuTriggerHoldable = style({
    touchAction: "none",
    userSelect: "none",
});

export const menuItem = style({
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

export const menuItems = style({
    position: "relative",
    isolation: "isolate",
    borderRadius: "inherit",
});

export const menuLayoutGroup = style({
    position: "absolute",
    inset: 0,
    pointerEvents: "none",
});

export const menuItemRegion = style({
    pointerEvents: "none",
});

export const contextMenuRegion = style({
    display: "flex",
    flexDirection: "column",
    minWidth: 0,
    minHeight: 0,
});

const LEVEL = `:is(${menuItems}, ${menuItems} [role="group"])`;
const ITEM = `:not(${floater})`;

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
