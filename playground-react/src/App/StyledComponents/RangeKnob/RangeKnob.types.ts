import type { InteractionFlags, RangeRenderProps } from "@thewaver/ss-components-react";

export type RangeKnobProps = {
    renderProps: InteractionFlags<RangeRenderProps>;
    startAngle: number;
    sweepAngle: number;
};
