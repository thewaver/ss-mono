import type { ReactNode } from "react";

import type {
    AccordionItem,
    AccordionMoveDirection,
    AccordionOrientation,
    AccordionSizing,
    CollapsibleFlags,
    CollapsibleSide,
    InteractionFlags,
} from "@thewaver/ss-components";

export type AccordionHeaderRenderer<T> = (
    item: AccordionItem<T>,
    flags: InteractionFlags<CollapsibleFlags>,
) => ReactNode;

export type AccordionPanelRenderer<T> = (
    item: AccordionItem<T>,
    visibilityTarget: 0 | 1,
    transitionDurationMs: number,
    moveDirection: AccordionMoveDirection | undefined,
) => ReactNode;

export type AccordionSectionProps<T> = {
    /** The item this section stands for, carrying whatever the consumer needs to draw its header and panel. */
    item: AccordionItem<T>;
    /** Which heading level this section's header sits at, so the page's outline stays correct. */
    headingLevel: number;
    /** Which side of its header this section's panel opens toward. */
    side: CollapsibleSide;
    /** Whether this section is open. */
    isExpanded: boolean;
    /** Whether this section sits in a row, so its panel is wrapped in a box the row can size. */
    isSideways: boolean;
    /** How wide the panel is, in pixels, or `undefined` to leave it as wide as its content. */
    openWidth: number | undefined;
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
    /** Which way the open section last moved, handed on to the panel. */
    moveDirection: AccordionMoveDirection | undefined;
};

export type AccordionProps<T> = {
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
    /**
     * Which sections are open, by item, with its setter. Both sides write it: the accordion when a header is pressed,
     * the consumer to open or close sections from outside. Leave it out and the accordion keeps the state itself,
     * starting with every section closed.
     */
    expanded?: readonly [T[], (expanded: T[]) => void];
    /** Draws a section's header. */
    renderHeader: AccordionHeaderRenderer<T>;
    /**
     * Draws a section's panel. Beside the visibility target and the duration it is told which way the open section
     * last moved — `forward` when the person opened one later in the list than the one they left, `backward` when
     * earlier, and `undefined` before anything has moved — so content can slide in from the side the person came
     * from. The motion is the consumer's.
     */
    renderPanel: AccordionPanelRenderer<T>;
};
