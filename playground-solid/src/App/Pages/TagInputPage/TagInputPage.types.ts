import type { Signal } from "solid-js";

import type { AccessorProps } from "@thewaver/ss-components-solid";

export type TagInputExampleProps = AccessorProps<{
    isDisabled: boolean;
    hasError: boolean;
    valueSignal: Signal<string[]>;
}>;
