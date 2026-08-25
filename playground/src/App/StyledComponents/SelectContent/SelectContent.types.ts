import type { AccessorProps, InteractionFlags, SelectFlags } from "@thewaver/ss-components";

export type SelectContentProps = AccessorProps<{
    flags: InteractionFlags<SelectFlags>;
    width?: number;
}>;
