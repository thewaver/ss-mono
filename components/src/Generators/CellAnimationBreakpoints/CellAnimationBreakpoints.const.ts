import type { CellAnimationBreakpointDirection, CellAnimationEasing } from "./CellAnimationBreakpoints.types";

export namespace CellAnimationBreakpoints {
    export const DIRECTIONS: readonly CellAnimationBreakpointDirection[] = ["asc", "desc"];

    export const EASINGS: readonly CellAnimationEasing[] = ["linear", "ease", "ease-in", "ease-out", "ease-in-out"];
}
