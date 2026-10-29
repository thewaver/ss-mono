import type { SliceAnimationRenderer } from "./SliceAnimation.types";

export const SLICE_ANIMATION_RENDERERS: readonly SliceAnimationRenderer[] = ["graphics_card", "elements"];

export const SLICE_ANIMATION_DEFAULTS = {
    renderer: "graphics_card" as SliceAnimationRenderer,
};
