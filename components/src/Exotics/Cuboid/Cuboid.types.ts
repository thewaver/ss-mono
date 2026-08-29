import type { Accessor, JSX } from "solid-js";

import type { AccessorProps, SignalSource } from "../../Utils/typeUtils";

export type CuboidFace = "front" | "right" | "back" | "left" | "top" | "bottom";

export type CuboidSize = {
    width: number;
    height: number;
    depth: number;
};

export type CuboidFaceState = {
    face: CuboidFace;
    isShowing: boolean;
};

export type CuboidProps = AccessorProps<{
    size: CuboidSize;
    transitionDurationMs?: number;
    ariaLabel: string;
    computeFaceLabel?: (face: CuboidFace) => string;
    yawSignal: SignalSource<number>;
    pitchSignal: SignalSource<number>;
    renderFace: (getFace: Accessor<CuboidFace>, getState: Accessor<CuboidFaceState>) => JSX.Element;
}>;
