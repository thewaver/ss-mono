import type { JSX, ParentProps } from "solid-js";

import type { PlacementLayoutFn, ProximityEffectFn, RadioGroupOrientation } from "@thewaver/ss-components";

import type { AccessorProps, SignalSource } from "../../../Utils/typeUtils";

export type RadioGroupProps<T> = ParentProps<
    AccessorProps<{
        /** Whether the options run across the page or down it. */
        orientation?: RadioGroupOrientation;
        /** The space between options. */
        gap?: number;
        /** The group's name when it is submitted as part of a form. */
        name?: string;
        /** Names the group for assistive technology. */
        ariaLabel?: string;
        /** Puts the group into its error look. */
        hasError?: boolean;
        /** Whether a value has to be given. It is announced and not enforced, because the library validates nothing. */
        isRequired?: boolean;
        /** How long the marker takes to slide from one option to the next. */
        transitionDurationMs?: number;
    }> & {
        /** Which option is picked. It is the only thing that picks one. */
        value: SignalSource<T>;
        /** Arranges the options, for a group that is something other than a straight run. */
        computeLayout?: PlacementLayoutFn;
        /** What the options do as the pointer nears them. */
        computeEffect?: ProximityEffectFn;
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
