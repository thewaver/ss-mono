import type { Signal } from "solid-js";

import type { SizeValue } from "@thewaver/ss-playground/App/Pages/RadioPage/RadioPage.types";

export type { SizeValue } from "@thewaver/ss-playground/App/Pages/RadioPage/RadioPage.types";

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
