import type { City } from "@thewaver/ss-playground/App/Pages/TextInputPage/TextInputPage.types";

export type { City } from "@thewaver/ss-playground/App/Pages/TextInputPage/TextInputPage.types";

export type TextInputExampleProps = {
    value: readonly [string, (value: string) => void];
};

export type TextInputPasswordExampleProps = TextInputExampleProps & {
    reveal: readonly [boolean, (isRevealed: boolean) => void];
};

export type TextInputCitiesExampleProps = TextInputExampleProps & {
    suggestions: City[];
};

export type TextInputEditableExampleProps = TextInputExampleProps & {
    editing: readonly [boolean, (isEditing: boolean) => void];
};
