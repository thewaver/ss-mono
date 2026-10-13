import type { InteractionFlags, RotatorPhase, WheelWedgeState } from "@thewaver/ss-components";

export type BasePageWheelWedgeValues = {
    state: WheelWedgeState;
};

export type BasePageWheelWedgeProps = BasePageWheelWedgeValues;

export type BasePageWheelCardValues = {
    state: WheelWedgeState;
    rank?: number;
};

export type BasePageWheelCardProps = BasePageWheelCardValues;

export type PageWheelPipSide = "top" | "left";

export type BasePageWheelPipValues = {
    side: PageWheelPipSide;
};

export type BasePageWheelPipProps = BasePageWheelPipValues;

export type BasePageWheelSpinValues = {
    flags: InteractionFlags;
    phase: RotatorPhase | undefined;
};

export type BasePageWheelSpinProps = BasePageWheelSpinValues;
