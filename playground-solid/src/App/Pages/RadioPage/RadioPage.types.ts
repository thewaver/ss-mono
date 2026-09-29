import type { Signal } from "solid-js";

export type SizeValue = "small" | "medium" | "large";

export type RadioExampleProps = {
    value: Signal<SizeValue>;
};

export type RadioOptionalExampleProps = {
    value: Signal<SizeValue | undefined>;
};

export type RadioRatingExampleProps = {
    value: Signal<number>;
    hovered: Signal<number | undefined>;
};
