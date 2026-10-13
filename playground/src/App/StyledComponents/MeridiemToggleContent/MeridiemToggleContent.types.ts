import type { InteractionFlags } from "@thewaver/ss-components";
import type { TimeValueMeridiem } from "@thewaver/ss-utils";

export type BaseMeridiemToggleContentValues = {
    flags: InteractionFlags;
    meridiem: TimeValueMeridiem;
};

export type BaseMeridiemToggleContentProps = BaseMeridiemToggleContentValues;
