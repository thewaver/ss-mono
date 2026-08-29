import type { Accessor, JSX } from "solid-js";

import type { Size2d } from "@thewaver/ss-utils";

import type { BarrelAxis, BarrelFace } from "../../Abstracts/Barrel/Barrel.types";
import type { AccessorProps, SignalSource } from "../../Utils/typeUtils";

export type FlipCardAxis = BarrelAxis;

export type FlipCardFace = BarrelFace;

export type FlipCardState = {
    face: FlipCardFace;
    isShowing: boolean;
};

export type FlipCardProps = AccessorProps<{
    axis?: FlipCardAxis;
    size: Size2d;
    transitionDurationMs?: number;
    ariaLabel: string;
    computeFaceLabel?: (face: FlipCardFace) => string;
    flippedSignal: SignalSource<boolean>;
    renderFront: (getState: Accessor<FlipCardState>) => JSX.Element;
    renderBack: (getState: Accessor<FlipCardState>) => JSX.Element;
}>;
