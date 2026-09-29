import type { DateValueEra } from "@thewaver/ss-components-svelte";

export type EraCycleProps = {
    era: string;
    options: DateValueEra[];
    isDisabled?: boolean;
    onChange: (next: string) => void;
};
