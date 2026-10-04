import { style } from "@vanilla-extract/css";

import { CarouselKnobs } from "../../Knobs/Carousels.const";

import { themeVars } from "../../Theme.css";

export const SCROLL_BOX_HEIGHT = 240;

export const slideFrame = style({
    display: "grid",
    minWidth: 0,
});

export const slideFrameNarrow = style({
    width: "55%",
    justifySelf: "center",
});

export const scrollBox = style({
    height: SCROLL_BOX_HEIGHT,
    overflowY: "scroll",
    overscrollBehavior: "contain",
});

export const scrollPinned = style({
    position: "sticky",
    top: 0,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    height: SCROLL_BOX_HEIGHT,
    marginBottom: -SCROLL_BOX_HEIGHT,
});

export const scrollRunway = style({
    height: SCROLL_BOX_HEIGHT * 3,
    marginBlock: SCROLL_BOX_HEIGHT,
});

export const ringStack = style({
    display: "flex",
    flexDirection: "column",
    gap: themeVars.spacing.full,
    alignItems: "center",
    width: "100%",
});

export const ringFrame = style({
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    paddingBlock: themeVars.spacing.quad,
});

export const ringFrameVertical = style({
    paddingBlock: CarouselKnobs.RING_SLOT_HEIGHT * CarouselKnobs.RING_RADIUS_RATIO,
});

export const ringSlot = style({
    width: CarouselKnobs.RING_SLOT_WIDTH,
    height: CarouselKnobs.RING_SLOT_HEIGHT,
});
