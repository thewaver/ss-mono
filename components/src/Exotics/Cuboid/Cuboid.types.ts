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
    /** How large the box is, in all three directions. */
    size: CuboidSize;
    /** How long one turn from face to face takes. */
    transitionDurationMs?: number;
    /** Names the box for assistive technology. */
    ariaLabel: string;
    /** Names one face, so a reader is told which side is showing. */
    computeFaceLabel: (face: CuboidFace) => string;
    /** What the box is called when it is announced, so a reader hears box rather than group. Defaults to "box". */
    roleDescription?: string;
    /** What one face is called when it is announced, so a reader hears face rather than group. Defaults to "face". */
    faceRoleDescription?: string;
    /** How far the box is turned left and right. It is the only thing that turns it. */
    yawSignal: SignalSource<number>;
    /** How far the box is tipped up and down. It is the only thing that tips it. */
    pitchSignal: SignalSource<number>;
    /** Draws one face, and is told which face it is. */
    renderFace: (getFace: Accessor<CuboidFace>, getState: Accessor<CuboidFaceState>) => JSX.Element;
}>;
