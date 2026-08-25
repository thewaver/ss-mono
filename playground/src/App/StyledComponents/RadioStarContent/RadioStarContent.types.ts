import type { AccessorProps, BinarySwitchFlags, InteractionFlags } from "@thewaver/ss-components";

export type RadioStarContentProps = AccessorProps<{
    flags: InteractionFlags<BinarySwitchFlags>;
    isFilled: boolean;
}>;
