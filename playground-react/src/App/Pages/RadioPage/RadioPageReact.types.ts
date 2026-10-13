import type { SizeValue } from "@thewaver/ss-playground/App/Pages/RadioPage/RadioPage.types";

export type { SizeValue } from "@thewaver/ss-playground/App/Pages/RadioPage/RadioPage.types";

export type RadioExampleProps = {
    value: readonly [SizeValue, (value: SizeValue) => void];
};

export type RadioOptionalExampleProps = {
    value: readonly [SizeValue | undefined, (value: SizeValue | undefined) => void];
};

export type RadioRatingExampleProps = {
    value: readonly [number, (value: number) => void];
    hovered: readonly [number | undefined, (value: number | undefined) => void];
};
