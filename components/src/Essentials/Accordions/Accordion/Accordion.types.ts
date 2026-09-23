import type { Accessor, JSX } from "solid-js";

import type { InteractionFlags } from "../../../Abstracts/InteractionTracker/InteractionTracker.types";
import type { AccessorProps, MaybeAccessor, SignalSource } from "../../../Utils/typeUtils";
import type { CollapsibleFlags } from "../Collapsible/Collapsible.types";

export type AccordionSizing = "fit-content" | "fill";

export type AccordionItem<T> = {
    value: T;
    isDisabled?: boolean;
    /**
     * Keeps this section's header in the tab order and the arrow-key walk while it is disabled, so focus can land on it
     * and a reader hears its name and that it is unavailable. It still cannot be opened or closed.
     */
    isReachableWhenDisabled?: boolean;
};

export type AccordionHeaderRenderer<T> = (
    getItem: Accessor<AccordionItem<T>>,
    getFlags: () => InteractionFlags<CollapsibleFlags>,
) => JSX.Element;

export type AccordionPanelRenderer<T> = (
    getItem: Accessor<AccordionItem<T>>,
    getVisibilityTarget: () => 0 | 1,
    getTransitionDurationMs: () => number,
) => JSX.Element;

export type AccordionSectionProps<T> = AccessorProps<{
    /** Which heading level this section's header sits at, so the page's outline stays correct. */
    headingLevel: number;
    /** Whether this section is open. */
    isExpanded: boolean;
    /** Scrolls this section into view once it has finished opening. */
    isScrolledIntoViewOnExpand?: boolean;
    /** Builds this section's panel only once it is first opened. */
    isPanelBuiltOnExpand?: boolean;
    /** How long this section takes to open and close. */
    transitionDurationMs?: number;
    /** Receives the section element once it exists, for a consumer that has to measure or scroll it. */
    ref?: (element: HTMLElement) => void;
    /** Runs when this section's header is activated. */
    onToggle: () => void;
}> & {
    /** The item this section stands for, carrying whatever the consumer needs to draw its header and panel. */
    item: MaybeAccessor<AccordionItem<T>>;
    /** Draws this section's header. */
    renderHeader: AccordionHeaderRenderer<T>;
    /** Draws this section's panel. */
    renderPanel: AccordionPanelRenderer<T>;
};

export type AccordionProps<T> = AccessorProps<{
    /** The space between sections. */
    gap?: number;
    /** Whether the accordion takes only the room its content needs, or fills the width it is given. */
    sizing?: AccordionSizing;
    /**
     * Which heading level the section headers sit at, so the page's outline stays correct wherever the accordion is
     * used.
     */
    headingLevel?: number;
    /** Closes whatever is open when another section is opened, so at most one is ever open. */
    isSingleExpand?: boolean;
    /**
     * Keeps at least one section open, so the last open one cannot be closed. It is what stops the accordion collapsing
     * to nothing.
     */
    isExpandRequired?: boolean;
    /** Scrolls a section into view once it has finished opening. */
    isScrolledIntoViewOnExpand?: boolean;
    /** Builds a section's panel only once it is first opened, rather than all of them up front. */
    isPanelBuiltOnExpand?: boolean;
    /** How long a section takes to open and close. */
    transitionDurationMs?: number;
}> & {
    /** The sections, in the order they are shown. */
    items: MaybeAccessor<AccordionItem<T>[]>;
    /**
     * Which sections are open, by item. Both sides write it: the accordion when a header is pressed, the consumer to
     * open or close sections from outside. Leave it out and the accordion keeps the state itself, starting with every
     * section closed.
     */
    expandedSignal?: SignalSource<T[]>;
    /** Draws a section's header. */
    renderHeader: AccordionHeaderRenderer<T>;
    /** Draws a section's panel. */
    renderPanel: AccordionPanelRenderer<T>;
};
