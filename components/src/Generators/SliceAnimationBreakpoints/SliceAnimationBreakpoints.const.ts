import type { SliceAnimationBreakpointDirection, SliceAnimationEasing } from "./SliceAnimationBreakpoints.types";

export namespace SliceAnimationBreakpoints {
    export const DIRECTIONS: readonly SliceAnimationBreakpointDirection[] = ["asc", "desc"];

    export const EASINGS: readonly SliceAnimationEasing[] = ["linear", "ease", "ease-in", "ease-out", "ease-in-out"];
}
