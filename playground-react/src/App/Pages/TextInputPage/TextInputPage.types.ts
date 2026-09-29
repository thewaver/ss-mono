export type TextInputExampleProps = {
    value: readonly [string, (value: string) => void];
};

export type TextInputPasswordExampleProps = TextInputExampleProps & {
    reveal: readonly [boolean, (isRevealed: boolean) => void];
};

export type City = {
    name: string;
    country: string;
};

export type TextInputCitiesExampleProps = TextInputExampleProps & {
    suggestions: City[];
};

export type TextInputEditableExampleProps = TextInputExampleProps & {
    editing: readonly [boolean, (isEditing: boolean) => void];
};
