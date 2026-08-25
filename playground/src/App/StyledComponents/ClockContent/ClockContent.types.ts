import type { AccessorProps, ClockFlags, InteractionFlags } from "@thewaver/ss-components";

export type ClockOptionProps = AccessorProps<{
    flags: InteractionFlags<ClockFlags>;
}>;
