import type { AccessorValues } from "@thewaver/ss-components-solid";
import type {
    BaseTypewriterComplexExampleValues,
    BaseTypewriterExampleCbs,
    BaseTypewriterKaraokeExampleValues,
    BaseTypewriterPhrasesExampleValues,
} from "@thewaver/ss-playground/App/Pages/TypewriterPage/TypewriterPage.types";

export type { TypewriterTextEffect } from "@thewaver/ss-playground/App/Pages/TypewriterPage/TypewriterTextEffect.types";

export type TypewriterExampleProps = BaseTypewriterExampleCbs;

export type TypewriterComplexExampleProps = TypewriterExampleProps & AccessorValues<BaseTypewriterComplexExampleValues>;

export type TypewriterPhrasesExampleProps = TypewriterExampleProps & AccessorValues<BaseTypewriterPhrasesExampleValues>;

export type TypewriterKaraokeExampleProps = AccessorValues<BaseTypewriterKaraokeExampleValues>;
