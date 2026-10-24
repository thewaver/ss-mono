import type { SlideButtonMode, SlideButtonOrientation } from "./SlideButton.types";

export const SLIDE_BUTTON_ORIENTATIONS: SlideButtonOrientation[] = ["horizontal", "vertical"];

export const SLIDE_BUTTON_MODES: SlideButtonMode[] = ["slide", "hold", "both"];

export const SLIDE_BUTTON_DEFAULTS = {
    orientation: "horizontal" as SlideButtonOrientation,
    thumbSize: 40,
    holdDurationMs: 1000,
    completionRatio: 1,
    mode: "both" as SlideButtonMode,
};
