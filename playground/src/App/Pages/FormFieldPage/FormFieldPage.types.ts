import type { Signal } from "solid-js";

import type { AccessorProps, FormFieldOrientation } from "@thewaver/ss-components";

export type FormFieldExampleProps = AccessorProps<{
    valueSignal: Signal<string>;
    orientation: FormFieldOrientation;
    gap: number;
    message: string;
    hasError: boolean;
}>;
