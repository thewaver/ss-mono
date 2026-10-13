import type { PlacementLayoutFn } from "../../../Abstracts/Placement/Placement.types";
import type { ProximityEffectFn } from "../../../Abstracts/Proximity/Proximity.types";

export type RadioGroupOrientation = "horizontal" | "vertical";

export type BaseRadioGroupValues = {
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
};

export type BaseRadioGroupCbs = {
    /**
     * Arranges the options, for a group that is something other than a straight run. Each `Radio` is handed the
     * placement at its position in the document, so the options are placed in the order a reader meets them.
     */
    computeLayout?: PlacementLayoutFn;
    /** What the options do as the pointer nears them. Only a group with `computeLayout` has anything to move. */
    computeEffect?: ProximityEffectFn;
};

export type BaseRadioGroupProps = BaseRadioGroupValues & BaseRadioGroupCbs;
