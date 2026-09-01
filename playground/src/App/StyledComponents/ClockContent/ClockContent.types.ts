import type { AccessorProps, ClockRenderProps, InteractionFlags } from "@thewaver/ss-components";

export type ClockOptionProps = AccessorProps<{
    renderProps: InteractionFlags<ClockRenderProps>;
}>;
