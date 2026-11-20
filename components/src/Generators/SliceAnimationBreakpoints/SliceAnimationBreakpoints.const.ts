import type { SliceAnimationBreakpointDirection, SliceAnimationEasing } from "./SliceAnimationBreakpoints.types";

export const SLICE_ANIMATION_BREAKPOINT_DEFAULTS = {
    smoothness: 0.25,
};

export namespace SliceAnimationBreakpoints {
    export const DIRECTIONS: readonly SliceAnimationBreakpointDirection[] = ["asc", "desc"];

    export const EASINGS: readonly SliceAnimationEasing[] = ["linear", "ease", "ease-in", "ease-out", "ease-in-out"];
}
