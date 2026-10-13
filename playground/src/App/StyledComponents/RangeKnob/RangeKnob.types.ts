import type { InteractionFlags, RangeRenderProps } from "@thewaver/ss-components";

export type BaseRangeKnobValues = {
    renderProps: InteractionFlags<RangeRenderProps>;
    startAngle: number;
    sweepAngle: number;
};

export type BaseRangeKnobProps = BaseRangeKnobValues;
