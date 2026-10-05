import type {
    AccessorProps,
    SlotTextLetterRoute,
    SlotTextMechanism,
    SlotTextReels,
} from "@thewaver/ss-components-solid";

export type SlotTextExampleProps = AccessorProps<{
    text: string;
    turnDurationMs: number;
    turnDelayMs: number;
}>;

export type SlotTextWordsExampleProps = SlotTextExampleProps &
    AccessorProps<{
        mechanism: SlotTextMechanism;
        letterRoute: SlotTextLetterRoute;
    }>;

export type SlotTextReelsExampleProps = AccessorProps<{
    text: string;
    reelKey: SlotTextReels.SampleKey;
}>;
