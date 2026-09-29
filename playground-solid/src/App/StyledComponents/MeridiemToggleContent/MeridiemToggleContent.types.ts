import type { AccessorProps, InteractionFlags } from "@thewaver/ss-components-solid";
import type { TimeValueMeridiem } from "@thewaver/ss-utils";

export type MeridiemToggleContentProps = AccessorProps<{
    flags: InteractionFlags;
    meridiem: TimeValueMeridiem;
}>;
