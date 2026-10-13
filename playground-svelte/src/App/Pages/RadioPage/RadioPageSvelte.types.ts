import type { SizeValue } from "@thewaver/ss-playground/App/Pages/RadioPage/RadioPage.types";

export type { SizeValue } from "@thewaver/ss-playground/App/Pages/RadioPage/RadioPage.types";

export type RadioExampleProps = {
    value: SizeValue;
};

export type RadioOptionalExampleProps = {
    value: SizeValue | undefined;
};

export type RadioRatingExampleProps = {
    value: number;
    hovered: number | undefined;
};
