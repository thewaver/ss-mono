import type { Accessor, JSX } from "solid-js";

import type { Size2d } from "@thewaver/ss-utils";

import type { BarrelAxis, BarrelFace } from "../../Primitives/Barrel/Barrel.types";
import type { AccessorProps, SignalSource } from "../../Utils/typeUtils";

export type FlipCardAxis = BarrelAxis;

export type FlipCardFace = BarrelFace;

export type FlipCardState = {
    face: FlipCardFace;
    isShowing: boolean;
};

export type FlipCardProps = AccessorProps<{
    /** Which way the card turns over. */
    axis?: FlipCardAxis;
    /** How large the card is. */
    size: Size2d;
    /** How long one turn takes. */
    transitionDurationMs?: number;
    /** Names the card for assistive technology. */
    ariaLabel: string;
    /** Names one face, so a reader is told which side is showing. */
    computeFaceLabel: (face: FlipCardFace) => string;
    /**
     * What the card is called when it is announced, so a reader hears flip card rather than group. Defaults to
     * "flip card".
     */
    roleDescription?: string;
    /** What one face is called when it is announced, so a reader hears face rather than group. Defaults to "face". */
    faceRoleDescription?: string;
    /** Which side is showing. It is the only thing that turns the card. */
    flippedSignal: SignalSource<boolean>;
    /** Draws the front. */
    renderFront: (getState: Accessor<FlipCardState>) => JSX.Element;
    /** Draws the back. */
    renderBack: (getState: Accessor<FlipCardState>) => JSX.Element;
}>;
