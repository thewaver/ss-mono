import type { ComponentPublicInstance, VNodeChild } from "vue";

import type {
    AnchorPlacement,
    ExternalInteractionFlags,
    InteractionActivation,
    InteractionFlags,
    InteractionSizing,
} from "@thewaver/ss-components";
import type { ShapeArrowAim } from "@thewaver/ss-utils";

import type { TooltipProps } from "../../Essentials/Overlays/Tooltip/Tooltip.types";

export type InteractionControlProps<TExtra extends object = {}> = {
    /**
     * Put on the element a consumer would actually target — the input, the button, the combobox — rather than on
     * any box around it, so an id is enough to reach the control from a label or a test.
     */
    id?: string;
    /** Names the control for assistive technology, where what it is called is not in its visible text. */
    ariaLabel?: string;
    /** The control's current interaction state, handed down so the painted part can answer to it. */
    flags: InteractionFlags<TExtra>;
};

export type InteractionControlSlots<TExtra extends object = {}> = {
    /**
     * Draws the control. Everything about how it looks is the consumer's; the wrapper owns events, focus, ARIA and
     * the tab order, and hands the state in rather than painting anything itself.
     */
    renderContent: (flags: InteractionFlags<TExtra>) => VNodeChild;
};

export type InteractionTooltipDefs<TExtra extends object = {}> = Omit<TooltipProps, "anchorRef"> & {
    /**
     * Draws the tooltip body. It is handed the control's state as well as the fade, since a tooltip on a control
     * usually exists to explain the state it is in, and last where an arrow pointing at the control would leave the
     * body, as `Tooltip` hands it, for a body that draws one.
     */
    renderContent: (props: {
        visibilityTarget: 0 | 1;
        transitionDurationMs: number;
        placement: AnchorPlacement;
        flags: InteractionFlags<TExtra>;
        arrowAim: ShapeArrowAim | undefined;
    }) => VNodeChild;
};

export type InteractionWrapperProps<TExtra extends object = {}> = ExternalInteractionFlags & {
    /** The ARIA role the control reports, where it is something other than what its markup implies. */
    role?: string;
    /** Whether the control takes only the room its content needs, or fills what it is given. */
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
     * reads its tooltip if it has one. Only means anything while the control is disabled.
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
     * Extra state to merge into the flags handed to every slot, so a control can paint against something the
     * wrapper knows nothing about.
     */
    extraFlags?: TExtra;
    /**
     * Runs when the control is activated, by pointer or by key. It is told how far the control was dragged and how
     * many presses have landed since mount, a count that goes up by one each time — a change in it is what lets a
     * repeated press restart an effect that is already running.
     */
    onActivation?: (activation: InteractionActivation) => void;
    /**
     * A tooltip for the control, anchored and shown by the wrapper. On a disabled control kept reachable, it is where
     * the reason for the disabling can be read.
     */
    tooltipDefs?: InteractionTooltipDefs<TExtra>;
};

export type InteractionWrapperSlots<TExtra extends object = {}> = {
    /**
     * Draws anything that sits alongside the control rather than inside it — a ripple, a focus ring, a badge — so
     * the painted control does not have to make room for it.
     */
    renderDecoration?: (flags: InteractionFlags<TExtra>) => VNodeChild;
    /**
     * Draws the element the wrapper drives. It is handed `setElementRef`, which has to be the `ref` of the real
     * interactive element — or of a component whose `$el` it is: that is what the wrapper listens on, anchors
     * tooltips to, puts ARIA on, and hands a consumer's own template ref as the wrapper's `$el`.
     */
    renderControl: (props: {
        setElementRef: (target: Element | ComponentPublicInstance | null) => void;
        flags: InteractionFlags<TExtra>;
    }) => VNodeChild;
};
