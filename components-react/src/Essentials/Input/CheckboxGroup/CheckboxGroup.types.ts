import type { PropsWithChildren } from "react";

import type { CheckboxGroupController, CheckboxGroupOrientation } from "@thewaver/ss-components";

export type CheckboxGroupProps<T> = PropsWithChildren<{
    /**
     * Names the group for assistive technology. Required, because a set of boxes read without it is heard as a run of
     * unrelated choices.
     */
    ariaLabel: string;
    /** Whether the boxes run across the page or down it. */
    orientation?: CheckboxGroupOrientation;
    /** The space between the boxes. */
    gap?: number;
    /**
     * Which members are ticked, as the list of their values, and how to change it. A `Checkbox` inside the group that
     * is given a `value` is ticked when that value is in the list, and pressing it adds or removes it. Leave it out
     * and the group holds the list itself, starting empty.
     */
    valueState?: readonly [T[], (values: T[]) => void];
    /**
     * Hands over what a select-all box needs, once the group is mounted: the state it should show and the command
     * that ticks or clears every member. The box itself is the consumer's to draw, wherever it goes. It is handed over
     * again, as a new object, whenever the state it reports changes — a select-all box usually sits outside the group
     * and renders before it, so a consumer keeping the controller in state is re-rendered with the group's answer
     * rather than left one change behind.
     */
    onMount?: (controller: CheckboxGroupController) => void;
}>;
