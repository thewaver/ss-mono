import type { JSX, ParentProps } from "solid-js";

import type { PlacementLayoutFn } from "../../../Abstracts/Placement/Placement.types";
import type { ProximityEffectFn } from "../../../Abstracts/Proximity/Proximity.types";
import type { AccessorProps, SignalSource } from "../../../Utils/typeUtils";

export type RadioGroupOrientation = "horizontal" | "vertical";

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
        valueSignal: SignalSource<T>;
        /** Arranges the options, for a group that is something other than a straight run. */
        computeLayout?: PlacementLayoutFn;
        /** What the options do as the pointer nears them. */
        computeEffect?: ProximityEffectFn;
        /** Draws the marker that follows the picked option. The fade is handed in rather than applied. */
        renderFloater?: (getVisibilityTarget: () => 0 | 1, getTransitionDurationMs: () => number) => JSX.Element;
    }
>;
