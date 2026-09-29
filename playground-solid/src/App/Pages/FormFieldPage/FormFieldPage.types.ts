import type { Signal } from "solid-js";

import type { AccessorProps, FormFieldOrientation } from "@thewaver/ss-components-solid";

export type FormFieldExampleProps = AccessorProps<{
    value: Signal<string>;
    orientation: FormFieldOrientation;
    gap: number;
    message: string;
    hasError: boolean;
}>;
