import type { Accessor, JSX } from "solid-js";

import type { InteractionFlags } from "../../Abstracts/InteractionTracker/InteractionTracker.types";
import type { AccessorProps, MaybeAccessor, SignalSource } from "../../Utils/typeUtils";
import type { CollapsibleFlags } from "../Collapsible/Collapsible.types";

export type AccordionSizing = "fit-content" | "fill";

export type AccordionItem<T> = {
    value: T;
    isDisabled?: boolean;
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
    headingLevel: number;
    isExpanded: boolean;
    isScrolledIntoViewOnExpand?: boolean;
    isPanelBuiltOnExpand?: boolean;
    transitionDurationMs?: number;
    ref?: (element: HTMLElement) => void;
    onToggle: () => void;
}> & {
    item: MaybeAccessor<AccordionItem<T>>;
    renderHeader: AccordionHeaderRenderer<T>;
    renderPanel: AccordionPanelRenderer<T>;
};

export type AccordionProps<T> = AccessorProps<{
    gap?: number;
    sizing?: AccordionSizing;
    headingLevel?: number;
    isSingleExpand?: boolean;
    isExpandRequired?: boolean;
    isScrolledIntoViewOnExpand?: boolean;
    isPanelBuiltOnExpand?: boolean;
    transitionDurationMs?: number;
}> & {
    items: MaybeAccessor<AccordionItem<T>[]>;
    expandedSignal: SignalSource<T[]>;
    renderHeader: AccordionHeaderRenderer<T>;
    renderPanel: AccordionPanelRenderer<T>;
};
