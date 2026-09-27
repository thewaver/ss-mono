import type { InteractionFlags, RotatorPhase, WheelWedgeState } from "@thewaver/ss-components-react";

export type PageWheelWedgeProps = {
    state: WheelWedgeState;
};

export type PageWheelCardProps = {
    state: WheelWedgeState;
    rank?: number;
};

export type PageWheelPipSide = "top" | "left";

export type PageWheelPipProps = {
    side: PageWheelPipSide;
};

export type PageWheelSpinProps = {
    flags: InteractionFlags;
    phase: RotatorPhase | undefined;
};
