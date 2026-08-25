import type { AccessorProps } from "@thewaver/ss-components";

export type TimePickerTriggerProps = AccessorProps<{
    key: string;
    isOpen: boolean;
    isDisabled?: boolean;
    onToggle: () => void;
}>;
