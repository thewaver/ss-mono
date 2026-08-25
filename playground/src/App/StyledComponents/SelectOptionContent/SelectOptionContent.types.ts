import type { AccessorProps, InteractionFlags, SelectOptionFlags } from "@thewaver/ss-components";

export type SelectOptionContentProps = AccessorProps<{
    flags: InteractionFlags<SelectOptionFlags>;
    description?: string;
}>;
