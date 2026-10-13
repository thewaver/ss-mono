import type { Signal } from "solid-js";

import type { AccessorProps, AccessorValues } from "@thewaver/ss-components-solid";
import type {
    BaseToolbarExampleCbs,
    BaseToolbarExampleValues,
} from "@thewaver/ss-playground/App/Pages/ToolbarPage/ToolbarPage.types";

export type ToolbarExampleProps = AccessorValues<BaseToolbarExampleValues> & BaseToolbarExampleCbs;

export type ToolbarPressedExampleProps = ToolbarExampleProps &
    AccessorProps<{
        pressedValues: Signal<string[]>;
    }>;
