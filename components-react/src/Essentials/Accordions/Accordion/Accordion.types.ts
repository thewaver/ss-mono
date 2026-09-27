import type { ReactNode } from "react";

import type { AccordionItem, AccordionSizing, CollapsibleFlags, InteractionFlags } from "@thewaver/ss-components";

export type AccordionHeaderRenderer<T> = (
    item: AccordionItem<T>,
    flags: InteractionFlags<CollapsibleFlags>,
) => ReactNode;

export type AccordionPanelRenderer<T> = (
    item: AccordionItem<T>,
    visibilityTarget: 0 | 1,
    transitionDurationMs: number,
) => ReactNode;

export type AccordionSectionProps<T> = {
    /** The item this section stands for, carrying whatever the consumer needs to draw its header and panel. */
    item: AccordionItem<T>;
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
    /** Receives the header element once it exists, for a consumer that has to measure or focus it. */
    ref?: (element: HTMLElement | null) => void;
    /** Runs when this section's header is activated. */
    onToggle: () => void;
    /** Draws this section's header. */
    renderHeader: AccordionHeaderRenderer<T>;
    /** Draws this section's panel. */
    renderPanel: AccordionPanelRenderer<T>;
};

export type AccordionProps<T> = {
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
    /** The sections, in the order they are shown. */
    items: AccordionItem<T>[];
    /**
     * Which sections are open, by item, with its setter. Both sides write it: the accordion when a header is pressed,
     * the consumer to open or close sections from outside. Leave it out and the accordion keeps the state itself,
     * starting with every section closed.
     */
    expandedState?: readonly [T[], (expanded: T[]) => void];
    /** Draws a section's header. */
    renderHeader: AccordionHeaderRenderer<T>;
    /** Draws a section's panel. */
    renderPanel: AccordionPanelRenderer<T>;
};
