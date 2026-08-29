import type { JSX, ParentProps } from "solid-js";

import type { AccessorProps, SignalSource } from "../../../Utils/typeUtils";

export type RadioGroupDir = "column" | "row";

export type RadioGroupProps<T> = ParentProps<
    AccessorProps<{
        dir?: RadioGroupDir;
        gap?: number;
        name?: string;
        ariaLabel?: string;
        hasError?: boolean;
        transitionDurationMs?: number;
    }> & {
        valueSignal: SignalSource<T>;
        renderFloater?: (getVisibilityTarget: () => 0 | 1, getTransitionDurationMs: () => number) => JSX.Element;
    }
>;
