import type { PropsWithChildren, ReactNode } from "react";

import type { PlacementLayoutFn, ProximityEffectFn, RadioGroupOrientation } from "@thewaver/ss-components";

export type RadioGroupProps<T> = PropsWithChildren<{
    /** Whether the options run across the page or down it. */
    orientation?: RadioGroupOrientation;
    /** The space between options. */
    gap?: number;
    /** The group's name when it is submitted as part of a form. Leave it out and the group makes one of its own. */
    name?: string;
    /** Names the group for assistive technology. */
    ariaLabel?: string;
    /** Puts the group into its error look. */
    hasError?: boolean;
    /** Whether a value has to be given. It is announced and not enforced, because the library validates nothing. */
    isRequired?: boolean;
    /** How long the marker takes to slide from one option to the next. */
    transitionDurationMs?: number;
    /**
     * Which option is picked, and how to change it. It is the only thing that picks one: each `Radio` inside is
     * checked when its `value` is this one, compared by identity.
     */
    value: readonly [T, (value: T) => void];
    /**
     * Arranges the options, for a group that is something other than a straight run. Each `Radio` is handed the
     * placement at its position in the document, so the options are placed in the order a reader meets them.
     */
    computeLayout?: PlacementLayoutFn;
    /** What the options do as the pointer nears them. Only a group with `computeLayout` has anything to move. */
    computeEffect?: ProximityEffectFn;
    /**
     * Draws the marker that slides to the picked option, behind it. The fade is handed in rather than applied: the
     * marker fades out when nothing is picked and in when something is.
     */
    renderSelectionFloater?: (visibilityTarget: 0 | 1, transitionDurationMs: number) => ReactNode;
    /**
     * Draws the marker that slides to the option under the pointer, or the one holding focus, behind it. It fades
     * out when neither is on an option, and is drawn under the picked option's marker where both are given.
     */
    renderHighlightFloater?: (visibilityTarget: 0 | 1, transitionDurationMs: number) => ReactNode;
}>;
