import type { Snippet } from "svelte";
import type { CheckboxGroupController, CheckboxGroupOrientation } from "@thewaver/ss-components";
export type CheckboxGroupProps<T> = {
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
     * Which members are ticked, as the list of their values. Bind it with `bind:value`. A `Checkbox` inside the group
     * that is given a `value` is ticked when that value is in the list, and pressing it adds or removes it. Leave it
     * out and the group holds the list itself, starting empty.
     */
    value?: T[];
    /**
     * Hands over what a select-all box needs, once the group is mounted: the state it should show and the command
     * that ticks or clears every member. The box itself is the consumer's to draw, wherever it goes. It is handed
     * over once, and `getCheckedState` follows the group from then on when it is read inside an effect, a `$derived`
     * or markup, so a select-all box drawn outside the group stays in step with it.
     */
    onMount?: (controller: CheckboxGroupController) => void;
    /** The boxes, each a `Checkbox` given a `value`. */
    children?: Snippet;
};
