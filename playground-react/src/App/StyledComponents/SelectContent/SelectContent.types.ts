import type { InteractionFlags, SelectFlags } from "@thewaver/ss-components-react";

export type SelectContentProps = {
    flags: InteractionFlags<SelectFlags>;
    width?: number;
    hasClearSpace?: boolean;
};
