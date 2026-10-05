import type { SlotTextLetterRoute, SlotTextMechanism, SlotTextReels } from "@thewaver/ss-components-svelte";

export type SlotTextExampleProps = {
    text: string;
    turnDurationMs: number;
    turnDelayMs: number;
};

export type SlotTextWordsExampleProps = SlotTextExampleProps & {
    mechanism: SlotTextMechanism;
    letterRoute: SlotTextLetterRoute;
};

export type SlotTextReelsExampleProps = {
    text: string;
    reelKey: SlotTextReels.SampleKey;
};
