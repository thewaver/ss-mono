import type { AccessorProps } from "../../Utils/typeUtils";

export type ScreenWiperShape = "lozenge" | "circle";

export type ScreenWiperDirection = "in" | "out";

export type ScreenWiperProps = AccessorProps<{
    /** Which way the first wipe runs, before anything has asked for one. */
    initialWipeDirection: ScreenWiperDirection;
    /** Which way the wipe runs. Changing it is what starts one. */
    wipeDirection: ScreenWiperDirection;
    /** The shape the cells are cut to. */
    shape?: ScreenWiperShape;
    /** How large one cell of the wipe is. Smaller cells make a finer sweep and more work per frame. */
    cellSize?: number;
    /** How long one wipe takes. */
    transitionDurationMs?: number;
    /** Runs once a wipe has finished, and is told which way it went. */
    onTransitionEnd?: (dir: ScreenWiperDirection) => void;
}>;
