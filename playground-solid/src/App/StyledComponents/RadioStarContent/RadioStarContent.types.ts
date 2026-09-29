import type { AccessorProps, BinarySwitchFlags, InteractionFlags } from "@thewaver/ss-components-solid";

export type RadioStarContentProps = AccessorProps<{
    flags: InteractionFlags<BinarySwitchFlags>;
    isFilled: boolean;
}>;
