import type { InteractionFlags, SelectOptionFlags } from "@thewaver/ss-components-vue";

export type SelectOptionContentProps = {
    flags: InteractionFlags<SelectOptionFlags>;
    description?: string;
    isGliding?: boolean;
};
