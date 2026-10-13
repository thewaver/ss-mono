import type {
    BaseTypewriterComplexExampleProps,
    BaseTypewriterExampleProps,
    BaseTypewriterKaraokeExampleProps,
    BaseTypewriterPhrasesExampleProps,
} from "@thewaver/ss-playground/App/Pages/TypewriterPage/TypewriterPage.types";

export type { TypewriterTextEffect } from "@thewaver/ss-playground/App/Pages/TypewriterPage/TypewriterTextEffect.types";

export type TypewriterExampleProps = BaseTypewriterExampleProps;

export type TypewriterComplexExampleProps = BaseTypewriterComplexExampleProps;

export type TypewriterPhrasesExampleProps = BaseTypewriterPhrasesExampleProps;

export type TypewriterKaraokeExampleProps = BaseTypewriterKaraokeExampleProps;

export type TypewriterExampleWrapperProps = TypewriterExampleProps & {
    width: number;
};
