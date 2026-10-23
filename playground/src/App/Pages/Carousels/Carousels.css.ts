import { globalStyle, style } from "@vanilla-extract/css";

import { NARROW_FRAME_RATIO } from "./Carousels.const";
import type { SlideFrame, SlideFrameSet } from "./Carousels.types";

import { CAROUSEL_SLIDE_HEIGHT } from "../../StyledComponents/CarouselContent/CarouselContent.css";
import { themeVars } from "../../Theme.css";

export const SCROLL_BOX_HEIGHT = 240;

export const slideFrame = style({
    display: "grid",
    minWidth: 0,
    userSelect: "none",
});

export const slideFrameNarrow = style([
    slideFrame,
    {
        width: `${NARROW_FRAME_RATIO * 100}%`,
        justifySelf: "center",
    },
]);

const PADDLE_UP_AND_DOWN_EDGE = themeVars.spacing.full;
const PADDLE_ACROSS_MARGIN = "6%";
const PADDLE_UP_AND_DOWN_MARGIN = "25%";
const PADDLE_UP_AND_DOWN_HEIGHT = 200;

const createPaddleFrames = (acrossHeight: number, upAndDownHeight: number): SlideFrameSet => {
    const upAndDownPanel = `calc(${upAndDownHeight}px / 2 - ${PADDLE_UP_AND_DOWN_EDGE})`;
    const upAndDownSpine = upAndDownHeight / 2;

    const upAndDownFront = style([
        slideFrame,
        {
            height: upAndDownPanel,
            marginTop: PADDLE_UP_AND_DOWN_EDGE,
            marginBottom: upAndDownSpine,
            marginInline: PADDLE_UP_AND_DOWN_MARGIN,
        },
    ]);

    globalStyle(`${upAndDownFront} > *`, { height: "100%" });

    return {
        horizontal: {
            front: style([
                slideFrame,
                {
                    height: acrossHeight,
                    marginLeft: "50%",
                    marginRight: PADDLE_ACROSS_MARGIN,
                    marginBlock: PADDLE_ACROSS_MARGIN,
                },
            ]),
            back: style([
                slideFrame,
                {
                    height: acrossHeight,
                    marginRight: "50%",
                    marginLeft: PADDLE_ACROSS_MARGIN,
                    marginBlock: PADDLE_ACROSS_MARGIN,
                },
            ]),
        },
        vertical: {
            front: upAndDownFront,
            back: style([
                slideFrame,
                {
                    height: upAndDownPanel,
                    marginBottom: PADDLE_UP_AND_DOWN_EDGE,
                    marginTop: upAndDownSpine,
                    marginInline: PADDLE_UP_AND_DOWN_MARGIN,
                },
            ]),
        },
    };
};

const toUnturnedFrames = (className: string): SlideFrameSet => ({
    horizontal: { front: className, back: className },
    vertical: { front: className, back: className },
});

export const slideFrames: Record<SlideFrame, SlideFrameSet> = {
    whole: toUnturnedFrames(slideFrame),
    narrow: toUnturnedFrames(slideFrameNarrow),
    paddle: createPaddleFrames(CAROUSEL_SLIDE_HEIGHT, PADDLE_UP_AND_DOWN_HEIGHT),
};

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
