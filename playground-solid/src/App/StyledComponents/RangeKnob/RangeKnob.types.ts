import type { AccessorProps, InteractionFlags, RangeRenderProps } from "@thewaver/ss-components-solid";

export type RangeKnobProps = AccessorProps<{
    renderProps: InteractionFlags<RangeRenderProps>;
    startAngle: number;
    sweepAngle: number;
}>;
