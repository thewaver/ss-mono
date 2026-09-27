export type TextInputExampleProps = {
    valueState: readonly [string, (value: string) => void];
};

export type TextInputPasswordExampleProps = TextInputExampleProps & {
    revealState: readonly [boolean, (isRevealed: boolean) => void];
};

export type City = {
    name: string;
    country: string;
};

export type TextInputCitiesExampleProps = TextInputExampleProps & {
    suggestions: City[];
};

export type TextInputEditableExampleProps = TextInputExampleProps & {
    editingState: readonly [boolean, (isEditing: boolean) => void];
};
