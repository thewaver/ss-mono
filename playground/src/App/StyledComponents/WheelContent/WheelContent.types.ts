import type { AccessorProps, InteractionFlags, RotationPhase, WheelWedgeState } from "@thewaver/ss-components";

export type PageWheelWedgeProps = AccessorProps<{
    state: WheelWedgeState;
}>;

export type PageWheelCardProps = AccessorProps<{
    state: WheelWedgeState;
    rank?: number;
}>;

export type PageWheelPipSide = "top" | "left";

export type PageWheelPipProps = AccessorProps<{
    side: PageWheelPipSide;
}>;

export type PageWheelSpinProps = AccessorProps<{
    flags: InteractionFlags;
    phase: RotationPhase | undefined;
}>;
