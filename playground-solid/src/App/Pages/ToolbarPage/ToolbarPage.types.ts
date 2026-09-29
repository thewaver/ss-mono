import type { Signal } from "solid-js";

import type { AccessorProps } from "@thewaver/ss-components-solid";

export type ToolbarExampleProps = AccessorProps<{
    gap: number;
    onActivate: (value: string) => void;
}>;

export type ToolbarPressedExampleProps = ToolbarExampleProps &
    AccessorProps<{
        pressedValues: Signal<string[]>;
    }>;
