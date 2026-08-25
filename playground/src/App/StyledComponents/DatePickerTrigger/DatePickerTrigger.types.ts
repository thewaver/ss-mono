import type { AccessorProps } from "@thewaver/ss-components";

export type DatePickerTriggerProps = AccessorProps<{
    key: string;
    isOpen: boolean;
    isDisabled?: boolean;
    onToggle: () => void;
}>;
