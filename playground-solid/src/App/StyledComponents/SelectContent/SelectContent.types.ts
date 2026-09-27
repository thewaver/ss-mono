import type { AccessorProps, InteractionFlags, SelectFlags } from "@thewaver/ss-components-solid";

export type SelectContentProps = AccessorProps<{
    flags: InteractionFlags<SelectFlags>;
    width?: number;
    hasClearSpace?: boolean;
}>;
