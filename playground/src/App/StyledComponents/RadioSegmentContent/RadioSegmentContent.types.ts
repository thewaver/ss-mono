import type { BinarySwitchFlags, InteractionFlags } from "@thewaver/ss-components";

export type BaseRadioSegmentContentValues = {
    flags: InteractionFlags<BinarySwitchFlags>;
};

export type BaseRadioSegmentContentProps = BaseRadioSegmentContentValues;

export type BaseRadioSegmentFloaterValues = {
    visibilityTarget: 0 | 1;
    transitionDurationMs: number;
};

export type BaseRadioSegmentFloaterProps = BaseRadioSegmentFloaterValues;
