import type { InteractionFlags, SelectFlags } from "@thewaver/ss-components-vue";

export type SelectContentProps = {
    flags: InteractionFlags<SelectFlags>;
    width?: number;
    hasClearSpace?: boolean;
};
