import type { City } from "@thewaver/ss-playground/App/Pages/TextInputPage/TextInputPage.types";

export type { City } from "@thewaver/ss-playground/App/Pages/TextInputPage/TextInputPage.types";

export type TextInputExampleProps = {
    value: string;
};

export type TextInputPasswordExampleProps = TextInputExampleProps & {
    reveal: boolean;
};

export type TextInputCitiesExampleProps = TextInputExampleProps & {
    suggestions: City[];
};

export type TextInputEditableExampleProps = TextInputExampleProps & {
    editing: boolean;
};
