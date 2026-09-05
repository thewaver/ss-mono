import type { Signal } from "solid-js";

import type { AccessorProps } from "@thewaver/ss-components";

export type FormFieldExampleProps = AccessorProps<{
    valueSignal: Signal<string>;
    dir: "column" | "row";
    gap: number;
    message: string;
    hasError: boolean;
}>;
