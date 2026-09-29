import type { Signal } from "solid-js";

import type { AccessorProps } from "@thewaver/ss-components-solid";

export type TextInputExampleProps = {
    value: Signal<string>;
};

export type TextInputPasswordExampleProps = TextInputExampleProps & {
    reveal: Signal<boolean>;
};

export type City = {
    name: string;
    country: string;
};

export type TextInputCitiesExampleProps = TextInputExampleProps &
    AccessorProps<{
        suggestions: City[];
    }>;

export type TextInputEditableExampleProps = TextInputExampleProps & {
    editing: Signal<boolean>;
};
