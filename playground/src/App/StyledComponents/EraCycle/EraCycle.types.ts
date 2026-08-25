import type { AccessorProps, DateValueEra } from "@thewaver/ss-components";

export type EraCycleProps = AccessorProps<{
    era: string;
    options: DateValueEra[];
    isDisabled?: boolean;
    onChange: (next: string) => void;
}>;
