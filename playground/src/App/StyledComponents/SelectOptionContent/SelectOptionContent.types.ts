import type { InteractionFlags, SelectOptionFlags } from "@thewaver/ss-components";

export type BaseSelectOptionContentValues = {
    flags: InteractionFlags<SelectOptionFlags>;
    description?: string;
    isGliding?: boolean;
};

export type BaseSelectOptionContentProps = BaseSelectOptionContentValues;
