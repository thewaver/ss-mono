import type { AccessorProps, BinarySwitchFlags, InteractionFlags } from "@thewaver/ss-components";

export type ToggleContentProps = AccessorProps<{
    flags: InteractionFlags<BinarySwitchFlags>;
}>;
