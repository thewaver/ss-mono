import type { AccessorValues } from "@thewaver/ss-components-solid";
import type {
    BaseScrambleTextExampleCbs,
    BaseScrambleTextExampleValues,
} from "@thewaver/ss-playground/App/Pages/ScrambleTextPage/ScrambleTextPage.types";

export type ScrambleTextExampleProps = AccessorValues<BaseScrambleTextExampleValues> & BaseScrambleTextExampleCbs;
