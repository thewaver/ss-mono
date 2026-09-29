export type SizeValue = "small" | "medium" | "large";

export type RadioExampleProps = {
    value: readonly [SizeValue, (value: SizeValue) => void];
};

export type RadioOptionalExampleProps = {
    value: readonly [SizeValue | undefined, (value: SizeValue | undefined) => void];
};

export type RadioRatingExampleProps = {
    value: readonly [number, (value: number) => void];
    hovered: readonly [number | undefined, (value: number | undefined) => void];
};
