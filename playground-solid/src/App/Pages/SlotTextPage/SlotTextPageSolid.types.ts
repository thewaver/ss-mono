import type { AccessorValues } from "@thewaver/ss-components-solid";
import type {
    BaseSlotTextExampleValues,
    BaseSlotTextReelsExampleValues,
    BaseSlotTextWordsExampleValues,
} from "@thewaver/ss-playground/App/Pages/SlotTextPage/SlotTextPage.types";

export type SlotTextExampleProps = AccessorValues<BaseSlotTextExampleValues>;

export type SlotTextWordsExampleProps = SlotTextExampleProps & AccessorValues<BaseSlotTextWordsExampleValues>;

export type SlotTextReelsExampleProps = AccessorValues<BaseSlotTextReelsExampleValues>;
