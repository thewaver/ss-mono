import type { InteractionFlags, SelectFlags } from "@thewaver/ss-components-svelte";

export type SelectContentProps = {
    flags: InteractionFlags<SelectFlags>;
    width?: number;
    hasClearSpace?: boolean;
};
