export type AccordionSizing = "fit-content" | "fill";

export type AccordionOrientation = "horizontal" | "vertical";

export type AccordionMoveDirection = "backward" | "forward";

export type AccordionItem<T> = {
    value: T;
    isDisabled?: boolean;
    /**
     * Keeps this section's header in the tab order and the arrow-key walk while it is disabled, so focus can land on it
     * and a reader hears its name and that it is unavailable. It still cannot be opened or closed.
     */
    isReachableWhenDisabled?: boolean;
};

export type BaseAccordionValues<T> = {
    /** The space between sections. */
    gap?: number;
    /** Whether the accordion takes only the room its content needs, or fills the width it is given. */
    sizing?: AccordionSizing;
    /**
     * Which way the sections run. `vertical`, the default, stacks them and each panel opens below its header,
     * growing in height. `horizontal` sets them side by side and each panel opens beside its header, growing in
     * width, so a closed section is a strip its header fills. The arrow keys that move between headers follow it:
     * up and down for a column, left and right for a row, reversed under right-to-left text.
     */
    orientation?: AccordionOrientation;
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
};

export type BaseAccordionProps<T> = BaseAccordionValues<T>;
