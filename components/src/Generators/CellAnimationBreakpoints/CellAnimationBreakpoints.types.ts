export type CellAnimationBreakpointDirection = "asc" | "desc";

export type CellAnimationEasing = "linear" | "ease" | "ease-in" | "ease-out" | "ease-in-out";

export type CellAnimationBreakpointOpts = {
    dir?: CellAnimationBreakpointDirection;
    smoothness?: number;
    easing?: CellAnimationEasing;
};

export type CellAnimationBreakpointTriple = [start: number, middle: number, end: number];
