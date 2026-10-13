import type { BinarySwitchFlags, InteractionFlags } from "@thewaver/ss-components";

export type BaseRadioStarContentValues = {
    flags: InteractionFlags<BinarySwitchFlags>;
    isFilled: boolean;
};

export type BaseRadioStarContentProps = BaseRadioStarContentValues;
