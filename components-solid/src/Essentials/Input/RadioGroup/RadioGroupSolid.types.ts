import type { JSX, ParentProps } from "solid-js";

import type { BaseRadioGroupCbs, BaseRadioGroupValues } from "@thewaver/ss-components";

import type { AccessorValues, SignalSource } from "../../../Utils/typeUtils";

export type RadioGroupProps<T> = ParentProps<
    AccessorValues<BaseRadioGroupValues> &
        BaseRadioGroupCbs & {
            /** Which option is picked. It is the only thing that picks one. */
            value: SignalSource<T>;
            /**
             * Draws the marker that slides to the picked option, behind it. The fade is handed in rather than applied: the
             * marker fades out when nothing is picked and in when something is.
             */
            renderSelectionFloater?: (
                getVisibilityTarget: () => 0 | 1,
                getTransitionDurationMs: () => number,
            ) => JSX.Element;
            /**
             * Draws the marker that slides to the option under the pointer, or the one holding focus, behind it. It fades
             * out when neither is on an option, and is drawn under the picked option's marker where both are given.
             */
            renderHighlightFloater?: (
                getVisibilityTarget: () => 0 | 1,
                getTransitionDurationMs: () => number,
            ) => JSX.Element;
        }
>;
