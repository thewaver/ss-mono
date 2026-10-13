import type { SlotTextLetterRoute, SlotTextMechanism, SlotTextReels } from "@thewaver/ss-components";

export type BaseSlotTextExampleValues = {
    text: string;
    turnDurationMs: number;
    turnDelayMs: number;
};

export type BaseSlotTextExampleProps = BaseSlotTextExampleValues;

export type BaseSlotTextWordsExampleValues = {
    mechanism: SlotTextMechanism;
    letterRoute: SlotTextLetterRoute;
};

export type BaseSlotTextWordsExampleProps = BaseSlotTextExampleProps & BaseSlotTextWordsExampleValues;

export type BaseSlotTextReelsExampleValues = {
    text: string;
    reelKey: SlotTextReels.SampleKey;
};

export type BaseSlotTextReelsExampleProps = BaseSlotTextReelsExampleValues;
