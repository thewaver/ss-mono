import type { AccessorProps } from "../../Utils/typeUtils";

export type ScreenWiperShape = "lozenge" | "circle";

export type ScreenWiperDirection = "in" | "out";

export type ScreenWiperProps = AccessorProps<{
    initialWipeDirection: ScreenWiperDirection;
    wipeDirection: ScreenWiperDirection;
    shape?: ScreenWiperShape;
    cellSize?: number;
    transitionDurationMs?: number;
    onTransitionEnd?: (dir: ScreenWiperDirection) => void;
}>;
