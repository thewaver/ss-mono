import { SLICE_ANIMATION_DEFAULTS } from "../../../Abstracts/SliceAnimation/SliceAnimation.const";
import type { RGBAnimationChannel } from "./RGBAnimation.types";

export const RGB_ANIMATION_DEFAULTS = {
    animationDurationMs: 1000,
    animationIterationCount: Infinity,
    animationIterationDelayMs: 2000,
    sizeAnchor: "width" as "width" | "height",
    renderer: SLICE_ANIMATION_DEFAULTS.renderer,
};

export const RGB_ANIMATION_CHANNELS: readonly RGBAnimationChannel[] = ["red", "green", "blue"];
