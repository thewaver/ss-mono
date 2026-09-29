export type TextInputExampleProps = {
    "value": string;
    "onUpdate:value"?: (value: string) => void;
};

export type TextInputPasswordExampleProps = TextInputExampleProps & {
    "reveal": boolean;
    "onUpdate:reveal"?: (isRevealed: boolean) => void;
};

export type City = {
    name: string;
    country: string;
};

export type TextInputCitiesExampleProps = TextInputExampleProps & {
    suggestions: City[];
};

export type TextInputEditableExampleProps = TextInputExampleProps & {
    "editing": boolean;
    "onUpdate:editing"?: (isEditing: boolean) => void;
};
