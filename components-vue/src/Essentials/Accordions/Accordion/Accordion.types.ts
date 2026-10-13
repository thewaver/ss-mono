import type { VNodeChild } from "vue";

import type {
    AccordionItem,
    AccordionMoveDirection,
    BaseAccordionProps,
    CollapsibleFlags,
    CollapsibleSide,
    InteractionFlags,
} from "@thewaver/ss-components";

export type AccordionHeaderRenderer<T> = (props: {
    item: AccordionItem<T>;
    flags: InteractionFlags<CollapsibleFlags>;
}) => VNodeChild;

export type AccordionPanelRenderer<T> = (props: {
    item: AccordionItem<T>;
    visibilityTarget: 0 | 1;
    transitionDurationMs: number;
    moveDirection: AccordionMoveDirection | undefined;
}) => VNodeChild;

export type AccordionSectionProps<T> = {
    /** The item this section stands for, carrying whatever the consumer needs to draw its header and panel. */
    item: AccordionItem<T>;
    /** Which heading level this section's header sits at, so the page's outline stays correct. */
    headingLevel: number;
    /** Which side of its header this section's panel opens toward. */
    side: CollapsibleSide;
    /** Whether this section is open. */
    isExpanded: boolean;
    /** Scrolls this section into view once it has finished opening. */
    isScrolledIntoViewOnExpand?: boolean;
    /** Builds this section's panel only once it is first opened. */
    isPanelBuiltOnExpand?: boolean;
    /** How long this section takes to open and close. */
    transitionDurationMs?: number;
    /** Which way the open section last moved, handed on to the panel. */
    moveDirection?: AccordionMoveDirection;
    /** Runs when this section's header is activated. */
    onToggle: () => void;
};

export type AccordionProps<T> = BaseAccordionProps<T> & {
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
    /**
     * Draws a section's panel. Beside the visibility target and the duration it is told which way the open section
     * last moved — `forward` when the person opened one later in the list than the one they left, `backward` when
     * earlier, and `undefined` before anything has moved — so content can slide in from the side the person came
     * from. The motion is the consumer's.
     */
    renderPanel: AccordionPanelRenderer<T>;
};
