import type { InteractionFlags, SelectOptionFlags } from "@thewaver/ss-components";

export type BaseSelectOptionContentValues = {
    flags: InteractionFlags<SelectOptionFlags>;
    description?: string;
    shortcut?: string;
    hasMark?: boolean;
    isGliding?: boolean;
};

export type BaseSelectOptionContentProps = BaseSelectOptionContentValues;
