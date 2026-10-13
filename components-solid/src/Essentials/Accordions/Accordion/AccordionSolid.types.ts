import type { Accessor, JSX } from "solid-js";

import type {
    AccordionItem,
    AccordionMoveDirection,
    BaseAccordionValues,
    CollapsibleFlags,
    CollapsibleSide,
    InteractionFlags,
} from "@thewaver/ss-components";

import type { AccessorProps, AccessorValues, MaybeAccessor, SignalSource } from "../../../Utils/typeUtils";

export type AccordionHeaderRenderer<T> = (
    getItem: Accessor<AccordionItem<T>>,
    getFlags: () => InteractionFlags<CollapsibleFlags>,
) => JSX.Element;

export type AccordionPanelRenderer<T> = (
    getItem: Accessor<AccordionItem<T>>,
    getVisibilityTarget: () => 0 | 1,
    getTransitionDurationMs: () => number,
    getMoveDirection: () => AccordionMoveDirection | undefined,
) => JSX.Element;

export type AccordionSectionProps<T> = AccessorProps<{
    /** Which heading level this section's header sits at, so the page's outline stays correct. */
    headingLevel: number;
    /** Which side of its header this section's panel opens toward. */
    side: CollapsibleSide;
    /** Whether this section is open. */
    isExpanded: boolean;
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
    /** Which way the open section last moved, handed on to the panel. */
    getMoveDirection: () => AccordionMoveDirection | undefined;
} & AccessorProps<{
        /** Scrolls this section into view once it has finished opening. */
        isScrolledIntoViewOnExpand?: boolean;
        /** Builds this section's panel only once it is first opened. */
        isPanelBuiltOnExpand?: boolean;
        /** How long this section takes to open and close. */
        transitionDurationMs?: number;
    }>;

export type AccordionProps<T> = AccessorValues<BaseAccordionValues<T>> & {
    /**
     * Which sections are open, by item. Both sides write it: the accordion when a header is pressed, the consumer to
     * open or close sections from outside. Leave it out and the accordion keeps the state itself, starting with every
     * section closed.
     */
    expanded?: SignalSource<T[]>;
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
