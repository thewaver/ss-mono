import type { JSX } from "solid-js";

import type { AnchorPlacement } from "../../Abstracts/Anchor/Anchor.types";
import type {
    ExternalInteractionFlags,
    InteractionActivation,
    InteractionFlags,
} from "../../Abstracts/InteractionTracker/InteractionTracker.types";
import type { TooltipProps } from "../../Essentials/Tooltip/Tooltip.types";
import type { AccessorProps, MaybeAccessor } from "../../Utils/typeUtils";

export type InteractionSizing = "fit-content" | "fill";

export type InteractionControlProps<TExtra extends object = {}> = {
    /**
     * Put on the element a consumer would actually target — the input, the button, the combobox — rather
     * than on any box around it, so an id is enough to reach the control from a label or a test.
     */
    id?: string;
    /** Names the control for assistive technology, where what it is called is not in its visible text. */
    ariaLabel?: string;
    /** The control's current interaction state, handed down so the painted part can answer to it. */
    flags: InteractionFlags<TExtra>;
    /** Receives the element once it exists, for a consumer that has to measure or focus it. */
    ref?: (element: HTMLElement) => void;
    /**
     * Draws the control. Everything about how it looks is the consumer's; the wrapper owns events, focus,
     * ARIA and the tab order, and hands the state in rather than painting anything itself.
     */
    renderContent: (getFlags: () => InteractionFlags<TExtra>) => JSX.Element;
};

export type InteractionTooltipDefs<TExtra extends object = {}> = Omit<TooltipProps, "anchorRef" | "renderContent"> & {
    /**
     * Draws the tooltip body. It is handed the control's state as well as the fade, since a tooltip on a
     * control usually exists to explain the state it is in.
     */
    renderContent: (
        getVisibilityTarget: () => 0 | 1,
        getTransitionDurationMs: () => number,
        getPlacement: () => AnchorPlacement,
        getFlags: () => InteractionFlags<TExtra>,
    ) => JSX.Element;
};

export type InteractionWrapperProps<TExtra extends object = {}> = AccessorProps<
    ExternalInteractionFlags & {
        /** The ARIA role the control reports, where it is something other than what its markup implies. */
        role?: JSX.AriaAttributes["role"];
        /** Whether the control takes only the room its content needs, or fills what it is given. */
        sizing?: InteractionSizing;
        /**
         * The smallest width the control may shrink to. It exists so a control stays large enough to be hit
         * accurately, rather than for layout.
         */
        minWidth?: number;
        /** The smallest height the control may shrink to, for the same reason as the width. */
        minHeight?: number;
        /**
         * Keeps a disabled control in the tab order so its tooltip can still be read — which is the point of
         * disabling it in a way that still explains itself. Only means anything while the control is
         * disabled, and only pairs with a tooltip.
         */
        isReachableWhenDisabled?: boolean;
        /**
         * Lets a disabled control take focus without putting it in the tab order, for a control reached by
         * something other than tabbing. Only means anything while the control is disabled.
         */
        isFocusableWhenDisabled?: boolean;
        /**
         * Whether the control is reachable by tabbing at all. Switch it off for a control inside a group
         * that manages its own walk, where the group is the one tab stop.
         */
        isTabbable?: boolean;
        /** Receives the element once it exists, for a consumer that has to measure or focus it. */
        ref?: (element: HTMLElement) => void;
    }
> & {
    /**
     * Extra state to merge into the flags handed to every render callback, so a control can paint against
     * something the wrapper knows nothing about.
     */
    extraFlags?: MaybeAccessor<TExtra>;
    /**
     * Runs when the control is activated, by pointer or by key. It is told how far the control was dragged
     * and how many activations have landed in quick succession, so a drag and a double click are both
     * readable from one callback.
     */
    onActivation?: (activation: InteractionActivation) => void;
    /**
     * A tooltip for the control, anchored and shown by the wrapper. Supplying one is also what makes
     * `isReachableWhenDisabled` worth setting, since it is the thing that becomes reachable.
     */
    tooltipDefs?: MaybeAccessor<InteractionTooltipDefs<TExtra> | undefined>;
    /**
     * Draws anything that sits alongside the control rather than inside it — a ripple, a focus ring, a badge
     * — so the painted control does not have to make room for it.
     */
    renderDecoration?: (getFlags: () => InteractionFlags<TExtra>) => JSX.Element;
    /**
     * Draws the element the wrapper drives. It is handed the ref setter, which has to reach the real
     * interactive element: that is what the wrapper listens on, anchors tooltips to, and puts ARIA on.
     */
    renderControl: (
        setElementRef: (element: HTMLElement) => void,
        getFlags: () => InteractionFlags<TExtra>,
    ) => JSX.Element;
};
