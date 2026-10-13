import type { City } from "@thewaver/ss-playground/App/Pages/TextInputPage/TextInputPage.types";

export type { City } from "@thewaver/ss-playground/App/Pages/TextInputPage/TextInputPage.types";

export type TextInputExampleProps = {
    "value": string;
    "onUpdate:value"?: (value: string) => void;
};

export type TextInputPasswordExampleProps = TextInputExampleProps & {
    "reveal": boolean;
    "onUpdate:reveal"?: (isRevealed: boolean) => void;
};

export type TextInputCitiesExampleProps = TextInputExampleProps & {
    suggestions: City[];
};

export type TextInputEditableExampleProps = TextInputExampleProps & {
    "editing": boolean;
    "onUpdate:editing"?: (isEditing: boolean) => void;
};
