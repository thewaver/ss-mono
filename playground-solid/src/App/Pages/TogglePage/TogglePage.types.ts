import type { Signal } from "solid-js";

import type { AccessorProps } from "@thewaver/ss-components-solid";

export type ToggleExampleProps = {
    checked: Signal<boolean>;
};

export type ToggleMixedExampleProps = AccessorProps<{
    all: Signal<boolean>;
    firstChild: Signal<boolean>;
    secondChild: Signal<boolean>;
    isMixed: boolean;
}>;
