import type { InteractionFlags, SelectOptionFlags } from "@thewaver/ss-components-react";

export type SelectOptionContentProps = {
    flags: InteractionFlags<SelectOptionFlags>;
    description?: string;
    isGliding?: boolean;
};
