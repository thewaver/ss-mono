export type SizeValue = "small" | "medium" | "large";

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
