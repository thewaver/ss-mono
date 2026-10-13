import type { Signal } from "solid-js";

import type { AccessorProps } from "@thewaver/ss-components-solid";
import type { City } from "@thewaver/ss-playground/App/Pages/TextInputPage/TextInputPage.types";

export type { City } from "@thewaver/ss-playground/App/Pages/TextInputPage/TextInputPage.types";

export type TextInputExampleProps = {
    value: Signal<string>;
};

export type TextInputPasswordExampleProps = TextInputExampleProps & {
    reveal: Signal<boolean>;
};

export type TextInputCitiesExampleProps = TextInputExampleProps &
    AccessorProps<{
        suggestions: City[];
    }>;

export type TextInputEditableExampleProps = TextInputExampleProps & {
    editing: Signal<boolean>;
};
