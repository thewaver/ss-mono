import type { InteractionFlags, SelectFlags } from "@thewaver/ss-components";

export type BaseSelectContentValues = {
    flags: InteractionFlags<SelectFlags>;
    width?: number;
    hasClearSpace?: boolean;
};

export type BaseSelectContentProps = BaseSelectContentValues;
