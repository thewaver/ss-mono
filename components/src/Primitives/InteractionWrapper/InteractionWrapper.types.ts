import type {
    ExternalInteractionFlags,
    InteractionActivation,
} from "../../Abstracts/InteractionTracker/InteractionTracker.types";

export type InteractionSizing = "fit-content" | "fill";

export type BaseInteractionWrapperValues<TExtra extends object = {}> = ExternalInteractionFlags & {
    /**
     * Whether the control takes only the room its content needs, or fills what it is given.
     *
     * With `"fill"` the painted content is stretched across the room as well, so a width the painter declares is
     * where it starts from rather than where it stops, and nothing has to measure the room to hand it back.
     */
    sizing?: InteractionSizing;
    /**
     * The smallest width the control may shrink to. It exists so a control stays large enough to be hit accurately,
     * rather than for layout.
     */
    minWidth?: number;
    /** The smallest height the control may shrink to, for the same reason as the width. */
    minHeight?: number;
    /**
     * Keeps a disabled control reachable by keyboard, so a reader learns it exists, hears that it is disabled, and
     * reads its tooltip if it has one. It is also what lets a disabled control show its tooltip on hover: without
     * it a disabled control shows no tooltip at all. Only means anything while the control is disabled.
     */
    isReachableWhenDisabled?: boolean;
    /**
     * Lets a disabled control take focus without putting it in the tab order, for a control reached by something
     * other than tabbing. Only means anything while the control is disabled.
     */
    isFocusableWhenDisabled?: boolean;
    /**
     * Whether the control is reachable by tabbing at all. Switch it off for a control inside a group that manages
     * its own walk, where the group is the one tab stop.
     */
    isTabbable?: boolean;
    /**
     * Extra state to merge into the flags handed to every render callback, so a control can paint against something
     * the wrapper knows nothing about.
     */
    extraFlags?: TExtra;
};

export type BaseInteractionWrapperCbs = {
    /**
     * Runs when the control is activated, by pointer or by key. It is told how far the control was dragged and how
     * many presses have landed since mount, a count that goes up by one each time — a change in it is what lets a
     * repeated press restart an effect that is already running.
     */
    onActivation?: (activation: InteractionActivation) => void;
};

export type BaseInteractionWrapperProps<TExtra extends object = {}> = BaseInteractionWrapperValues<TExtra> &
    BaseInteractionWrapperCbs;
