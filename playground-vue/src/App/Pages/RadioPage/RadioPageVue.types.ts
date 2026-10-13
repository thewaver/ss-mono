import type { SizeValue } from "@thewaver/ss-playground/App/Pages/RadioPage/RadioPage.types";

export type { SizeValue } from "@thewaver/ss-playground/App/Pages/RadioPage/RadioPage.types";

export type RadioExampleProps = {
    "value": SizeValue;
    "onUpdate:value"?: (value: SizeValue) => void;
};

export type RadioOptionalExampleProps = {
    "value": SizeValue | undefined;
    "onUpdate:value"?: (value: SizeValue | undefined) => void;
};

export type RadioRatingExampleProps = {
    "value": number;
    "onUpdate:value"?: (value: number) => void;
    "hovered": number | undefined;
    "onUpdate:hovered"?: (value: number | undefined) => void;
};
