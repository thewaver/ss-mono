export type SizeValue = "small" | "medium" | "large";

export type RadioExampleProps = {
    valueState: readonly [SizeValue, (value: SizeValue) => void];
};

export type RadioOptionalExampleProps = {
    valueState: readonly [SizeValue | undefined, (value: SizeValue | undefined) => void];
};

export type RadioRatingExampleProps = {
    valueState: readonly [number, (value: number) => void];
    hoveredState: readonly [number | undefined, (value: number | undefined) => void];
};
