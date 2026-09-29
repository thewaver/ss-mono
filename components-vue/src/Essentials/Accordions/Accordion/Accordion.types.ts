import type { VNodeChild } from "vue";

import type { AccordionItem, AccordionSizing, CollapsibleFlags, InteractionFlags } from "@thewaver/ss-components";

export type AccordionHeaderRenderer<T> = (props: {
    item: AccordionItem<T>;
    flags: InteractionFlags<CollapsibleFlags>;
}) => VNodeChild;

export type AccordionPanelRenderer<T> = (props: {
    item: AccordionItem<T>;
    visibilityTarget: 0 | 1;
    transitionDurationMs: number;
}) => VNodeChild;

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
    /** Runs when this section's header is activated. */
    onToggle: () => void;
};

export type AccordionProps<T> = {
    /** The space between sections. */
    "gap"?: number;
    /** Whether the accordion takes only the room its content needs, or fills the width it is given. */
    "sizing"?: AccordionSizing;
    /**
     * Which heading level the section headers sit at, so the page's outline stays correct wherever the accordion is
     * used.
     */
    "headingLevel"?: number;
    /** Closes whatever is open when another section is opened, so at most one is ever open. */
    "isSingleExpand"?: boolean;
    /**
     * Keeps at least one section open, so the last open one cannot be closed. It is what stops the accordion collapsing
     * to nothing.
     */
    "isExpandRequired"?: boolean;
    /** Scrolls a section into view once it has finished opening. */
    "isScrolledIntoViewOnExpand"?: boolean;
    /** Builds a section's panel only once it is first opened, rather than all of them up front. */
    "isPanelBuiltOnExpand"?: boolean;
    /** How long a section takes to open and close. */
    "transitionDurationMs"?: number;
    /** The sections, in the order they are shown. */
    "items": AccordionItem<T>[];
    /**
     * Which sections are open, by item. Both sides write it: the accordion when a header is pressed, the consumer to
     * open or close sections from outside. Leave it out and the accordion keeps the state itself, starting with every
     * section closed.
     */
    "expanded"?: T[];
    /** Receives the sections left open after a header is pressed, which is what `v-model:expanded` binds. */
    "onUpdate:expanded"?: (expanded: T[]) => void;
};

export type AccordionSlots<T> = {
    /** Draws a section's header. */
    renderHeader: AccordionHeaderRenderer<T>;
    /** Draws a section's panel. */
    renderPanel: AccordionPanelRenderer<T>;
};
