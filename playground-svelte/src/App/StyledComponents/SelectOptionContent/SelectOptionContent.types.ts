import type { InteractionFlags, SelectOptionFlags } from "@thewaver/ss-components-svelte";

export type SelectOptionContentProps = {
    flags: InteractionFlags<SelectOptionFlags>;
    description?: string;
    isGliding?: boolean;
};
