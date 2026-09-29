export type TextInputExampleProps = {
    value: string;
};

export type TextInputPasswordExampleProps = TextInputExampleProps & {
    reveal: boolean;
};

export type City = {
    name: string;
    country: string;
};

export type TextInputCitiesExampleProps = TextInputExampleProps & {
    suggestions: City[];
};

export type TextInputEditableExampleProps = TextInputExampleProps & {
    editing: boolean;
};
