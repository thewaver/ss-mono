import type { InteractionFlags } from "@thewaver/ss-components-vue";
import type { TimeValueMeridiem } from "@thewaver/ss-utils";

export type MeridiemToggleContentProps = {
    flags: InteractionFlags;
    meridiem: TimeValueMeridiem;
};
