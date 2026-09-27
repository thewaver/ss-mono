import type { AccessorProps } from "@thewaver/ss-components-solid";
import type { TimeValueMeridiem } from "@thewaver/ss-utils";

export type MeridiemToggleProps = AccessorProps<{
    meridiem: TimeValueMeridiem;
    isDisabled?: boolean;
    onToggle: () => void;
}>;
