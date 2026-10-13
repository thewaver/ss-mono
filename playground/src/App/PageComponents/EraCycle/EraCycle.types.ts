import type { DateValueEra } from "@thewaver/ss-components";

export type BaseEraCycleValues = {
    era: string;
    options: DateValueEra[];
    isDisabled?: boolean;
};

export type BaseEraCycleCbs = {
    onChange: (next: string) => void;
};

export type BaseEraCycleProps = BaseEraCycleValues & BaseEraCycleCbs;
