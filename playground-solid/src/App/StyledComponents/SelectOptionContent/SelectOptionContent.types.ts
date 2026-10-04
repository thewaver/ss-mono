import type { AccessorProps, InteractionFlags, SelectOptionFlags } from "@thewaver/ss-components-solid";

export type SelectOptionContentProps = AccessorProps<{
    flags: InteractionFlags<SelectOptionFlags>;
    description?: string;
    isGliding?: boolean;
}>;
