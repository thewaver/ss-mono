import type { AccessorProps, InteractionFlags } from "@thewaver/ss-components";
import type { TimeValueMeridiem } from "@thewaver/ss-utils";

export type MeridiemToggleContentProps = AccessorProps<{
    flags: InteractionFlags;
    meridiem: TimeValueMeridiem;
}>;
