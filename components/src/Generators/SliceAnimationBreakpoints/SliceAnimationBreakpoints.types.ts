export type SliceAnimationBreakpointDirection = "asc" | "desc";

export type SliceAnimationEasing = "linear" | "ease" | "ease-in" | "ease-out" | "ease-in-out";

export type SliceAnimationBreakpointOpts = {
    dir?: SliceAnimationBreakpointDirection;
    smoothness?: number;
    easing?: SliceAnimationEasing;
};

export type SliceAnimationBreakpointTriple = [start: number, middle: number, end: number];
