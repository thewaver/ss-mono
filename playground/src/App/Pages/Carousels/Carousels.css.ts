import { style } from "@vanilla-extract/css";

import { CarouselKnobs } from "../../Knobs/Carousels.const";
import type { SlideFrame, SlideFrameSet } from "./Carousels.types";

import { CAROUSEL_SLIDE_HEIGHT } from "../../StyledComponents/CarouselContent/CarouselContent.css";
import { themeVars } from "../../Theme.css";

export const SCROLL_BOX_HEIGHT = 240;

export const slideFrame = style({
    display: "grid",
    minWidth: 0,
});

export const slideFrameNarrow = style([
    slideFrame,
    {
        width: "55%",
        justifySelf: "center",
    },
]);

const PADDLE_CORE = themeVars.spacing.full;
const PADDLE_ACROSS_MARGIN = "6%";
const PADDLE_UP_AND_DOWN_MARGIN = "10%";

const createPaddleFrames = (acrossHeight: number, upAndDownHeight: number): SlideFrameSet => ({
    horizontal: {
        front: style([
            slideFrame,
            {
                height: acrossHeight,
                marginLeft: `calc(50% + ${PADDLE_CORE})`,
                marginRight: PADDLE_ACROSS_MARGIN,
                marginBlock: PADDLE_ACROSS_MARGIN,
            },
        ]),
        back: style([
            slideFrame,
            {
                height: acrossHeight,
                marginRight: `calc(50% + ${PADDLE_CORE})`,
                marginLeft: PADDLE_ACROSS_MARGIN,
                marginBlock: PADDLE_ACROSS_MARGIN,
            },
        ]),
    },
    vertical: {
        front: style([
            slideFrame,
            {
                height: upAndDownHeight,
                marginTop: PADDLE_CORE,
                marginBottom: `calc(${upAndDownHeight}px + ${PADDLE_CORE} * 3)`,
                marginInline: PADDLE_UP_AND_DOWN_MARGIN,
            },
        ]),
        back: style([
            slideFrame,
            {
                height: upAndDownHeight,
                marginBottom: PADDLE_CORE,
                marginTop: `calc(${upAndDownHeight}px + ${PADDLE_CORE} * 3)`,
                marginInline: PADDLE_UP_AND_DOWN_MARGIN,
            },
        ]),
    },
});

const toUnturnedFrames = (className: string): SlideFrameSet => ({
    horizontal: { front: className, back: className },
    vertical: { front: className, back: className },
});

export const slideFrames: Record<SlideFrame, SlideFrameSet> = {
    whole: toUnturnedFrames(slideFrame),
    narrow: toUnturnedFrames(slideFrameNarrow),
    paddle: createPaddleFrames(CAROUSEL_SLIDE_HEIGHT, CAROUSEL_SLIDE_HEIGHT),
};

export const ringFrames = createPaddleFrames(CarouselKnobs.RING_PANEL_HEIGHT, CAROUSEL_SLIDE_HEIGHT);

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

export const ringSlot = style({
    width: CarouselKnobs.RING_SLOT_WIDTH,
    maxWidth: "100%",
});

export const wordDrumSlot = style({
    width: "100%",
    height: CarouselKnobs.WORD_DRUM_SLOT_HEIGHT,
});

export const wordDrumWord = style({
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "100%",
    fontSize: themeVars.fontSize.xLarge,
    fontWeight: "bold",
});
