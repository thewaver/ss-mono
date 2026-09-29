import type { DateValueEra } from "@thewaver/ss-components-vue";

export type EraCycleProps = {
    era: string;
    options: DateValueEra[];
    isDisabled?: boolean;
    onChange: (next: string) => void;
};
