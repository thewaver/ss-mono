import type { AccessorProps, InteractionFlags, RangeRenderProps } from "@thewaver/ss-components";

export type RangeKnobProps = AccessorProps<{
    renderProps: InteractionFlags<RangeRenderProps>;
    startAngle: number;
    sweepAngle: number;
}>;
