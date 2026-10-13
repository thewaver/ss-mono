import type { AccessorValues } from "@thewaver/ss-components-solid";
import type {
    BaseCardStackDeckExampleCbs,
    BaseCardStackDeckExampleValues,
    BaseCardStackEndlessExampleCbs,
    BaseCardStackEndlessExampleValues,
} from "@thewaver/ss-playground/App/Pages/CardStackPage/CardStackExamples.types";

export type CardStackDeckExampleProps = AccessorValues<BaseCardStackDeckExampleValues> & BaseCardStackDeckExampleCbs;

export type CardStackEndlessExampleProps = AccessorValues<BaseCardStackEndlessExampleValues> &
    BaseCardStackEndlessExampleCbs;
