import { globalStyle, style } from "@vanilla-extract/css";

import { CornerRunUtils } from "../../Abstracts/CornerRun/CornerRun.utils";

import { interactionRoot } from "../../Primitives/InteractionWrapper/InteractionWrapper.css";
import { buttonElement } from "../Buttons/Button/Button.css";

export const toolbarRoot = style({
    position: "relative",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    minWidth: 0,
    borderRadius: "inherit",
});

export const toolbarItem = style({
    flex: "none",
    borderRadius: 0,
});

export const toolbarMeasuredItem = style({
    position: "absolute",
    top: 0,
    left: 0,
    visibility: "hidden",
    pointerEvents: "none",
});

export const toolbarButton = style([buttonElement, {}]);

const SHOWN_ITEM = `${toolbarItem}:not(${toolbarMeasuredItem})`;

globalStyle(`${toolbarItem} > ${interactionRoot}, ${toolbarItem} > ${interactionRoot} > *`, {
    borderRadius: "inherit",
});

globalStyle(
    `${toolbarRoot} > ${SHOWN_ITEM}:nth-child(1 of ${SHOWN_ITEM})`,
    CornerRunUtils.computeEdge("row", "leading", "inherit"),
);

globalStyle(
    `${toolbarRoot} > ${SHOWN_ITEM}:nth-last-child(1 of ${SHOWN_ITEM})`,
    CornerRunUtils.computeEdge("row", "trailing", "inherit"),
);
