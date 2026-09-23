import type { Signal } from "solid-js";

import type { AccessorProps } from "@thewaver/ss-components";

export type TextInputExampleProps = {
    valueSignal: Signal<string>;
};

export type TextInputPasswordExampleProps = TextInputExampleProps & {
    revealSignal: Signal<boolean>;
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
    editingSignal: Signal<boolean>;
};
