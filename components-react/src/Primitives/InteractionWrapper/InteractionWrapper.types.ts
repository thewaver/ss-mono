import type { AriaRole, ReactNode } from "react";

import type { AnchorPlacement, BaseInteractionWrapperProps, InteractionFlags } from "@thewaver/ss-components";
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
    /** Receives the element once it exists, for a consumer that has to measure or focus it. */
    ref?: (element: HTMLElement | null) => void;
    /**
     * Draws the control. Everything about how it looks is the consumer's; the wrapper owns events, focus, ARIA and
     * the tab order, and hands the state in rather than painting anything itself.
     */
    renderContent: (flags: InteractionFlags<TExtra>) => ReactNode;
};

export type InteractionTooltipDefs<TExtra extends object = {}> = Omit<TooltipProps, "anchorRef" | "renderContent"> & {
    /**
     * Draws the tooltip body. It is handed the control's state as well as the fade, since a tooltip on a control
     * usually exists to explain the state it is in, and last where an arrow pointing at the control would leave the
     * body, as `Tooltip` hands it, for a body that draws one.
     */
    renderContent: (
        visibilityTarget: 0 | 1,
        transitionDurationMs: number,
        placement: AnchorPlacement,
        flags: InteractionFlags<TExtra>,
        arrowAim: ShapeArrowAim | undefined,
    ) => ReactNode;
};

export type InteractionWrapperProps<TExtra extends object = {}> = BaseInteractionWrapperProps<TExtra> & {
    /** The ARIA role the control reports, where it is something other than what its markup implies. */
    role?: AriaRole;
    /** Receives the element once it exists, for a consumer that has to measure or focus it. */
    ref?: (element: HTMLElement | null) => void;
    /**
     * A tooltip for the control, anchored and shown by the wrapper. On a disabled control kept reachable, it is where
     * the reason for the disabling can be read. A disabled control that is not kept reachable shows no tooltip, by
     * pointer or by keyboard.
     */
    tooltipDefs?: InteractionTooltipDefs<TExtra>;
    /**
     * Draws anything that sits alongside the control rather than inside it — a ripple, a focus ring, a badge — so
     * the painted control does not have to make room for it.
     */
    renderDecoration?: (flags: InteractionFlags<TExtra>) => ReactNode;
    /**
     * Draws the element the wrapper drives. It is handed the ref setter, which has to reach the real interactive
     * element: that is what the wrapper listens on, anchors tooltips to, and puts ARIA on.
     */
    renderControl: (setElementRef: (element: HTMLElement | null) => void, flags: InteractionFlags<TExtra>) => ReactNode;
};
