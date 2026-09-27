import type { ParentProps } from "solid-js";

import type { CheckboxGroupController, CheckboxGroupOrientation } from "@thewaver/ss-components";

import type { AccessorProps, SignalSource } from "../../../Utils/typeUtils";

export type CheckboxGroupProps<T> = ParentProps<
    AccessorProps<{
        /**
         * Names the group for assistive technology. Required, because a set of boxes read without it is heard as a
         * run of unrelated choices.
         */
        ariaLabel: string;
        /** Whether the boxes run across the page or down it. */
        orientation?: CheckboxGroupOrientation;
        /** The space between the boxes. */
        gap?: number;
    }> & {
        /**
         * Which members are ticked, as the list of their values. A `Checkbox` inside the group that is given a
         * `value` is ticked when that value is in the list, and pressing it adds or removes it. Leave it out and
         * the group holds the list itself, starting empty.
         */
        valueSignal?: SignalSource<T[]>;
        /**
         * Hands over what a select-all box needs, once the group is mounted: the state it should show and the
         * command that ticks or clears every member. The box itself is the consumer's to draw, wherever it goes.
         */
        onMount?: (controller: CheckboxGroupController) => void;
    }
>;
