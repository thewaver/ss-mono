import type { AccessorProps, InteractionFlags, RangeFlags } from "@thewaver/ss-components";

export type RangeContentProps = AccessorProps<{
    flags: InteractionFlags<RangeFlags>;
    length?: number;
}>;
