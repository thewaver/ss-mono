import type { InteractionFlags, RangeRenderProps } from "@thewaver/ss-components-vue";

export type RangeKnobProps = {
    renderProps: InteractionFlags<RangeRenderProps>;
    startAngle: number;
    sweepAngle: number;
};
