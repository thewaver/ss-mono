import type { Accessor, JSX } from "solid-js";

import type { InteractionFlags } from "../../Abstracts/InteractionTracker/InteractionTracker.types";
import type { PlacementLayoutFn, PlacementRect } from "../../Abstracts/Placement/Placement.types";
import type { ProximityEffectFn } from "../../Abstracts/Proximity/Proximity.types";
import type { InteractionControlProps } from "../../Primitives/InteractionWrapper/InteractionWrapper.types";
import type { AccessorProps, MaybeAccessor } from "../../Utils/typeUtils";

export type TableOfContentsOrientation = "horizontal" | "vertical";

export type TableOfContentsLink<T> = {
    /** What identifies the section, and what `onCurrentChange` reports when it becomes current. */
    value: T;
    /**
     * The element this link leads to, usually the heading of its section. It is the consumer's, rendered wherever
     * the article is, and it is `undefined` until that element exists. The link is current once this element's top
     * has scrolled past the line, and pressing the link scrolls it into view and moves focus onto it.
     */
    target: HTMLElement | undefined;
    /**
     * The address of the target, usually `#` and its id. With one the link is a real anchor, so it can be opened in a
     * new tab or copied; without one it is a button that does the same scroll.
     */
    href?: string;
    /** How far this link sits below the top level of the outline, from `0`. Handed to the painter so it can indent. */
    depth?: number;
    /** Put on the link element itself, so a label or a test can reach it. */
    id?: string;
};

export type TableOfContentsFlags = {
    /** Whether this link's section is the one being read. */
    isCurrent: boolean;
};

export type TableOfContentsItemProps<T> = AccessorProps<Omit<InteractionControlProps<TableOfContentsFlags>, "id">> & {
    /** The link this item stands for. */
    link: MaybeAccessor<TableOfContentsLink<T>>;
};

export type TableOfContentsNameProps =
    | AccessorProps<{
          /**
           * Names the list for assistive technology. One of this and `ariaLabelledBy` is required, because the `<nav>`
           * around the links is a landmark, and a page holding it beside its own site navigation gives a reader no way
           * to tell two unnamed ones apart.
           */
          ariaLabel: string;
          ariaLabelledBy?: undefined;
      }>
    | AccessorProps<{
          ariaLabel?: undefined;
          /**
           * Points at the element whose text names the list, for a table of contents that already shows its own title.
           * One of this and `ariaLabel` is required, because the `<nav>` around the links is a landmark and an unnamed
           * one cannot be told apart from the site's own.
           */
          ariaLabelledBy: string;
      }>;

export type TableOfContentsProps<T> = TableOfContentsNameProps &
    AccessorProps<{
        /** Whether the links run down the page or across it. */
        orientation?: TableOfContentsOrientation;
        /** The space between links. */
        gap?: number;
        /**
         * How far down the viewport the line sits that decides which section is current, as a share of its height. A
         * section becomes current once its target's top has scrolled above the line.
         */
        offsetRatio?: number;
    }> & {
        /**
         * The links, in reading order. The list stays flat for the keyboard and for a screen reader whatever depths
         * the records carry.
         */
        links: MaybeAccessor<TableOfContentsLink<T>[]>;
        /** Arranges the links, for a list that is something other than a straight run. */
        computeLayout?: PlacementLayoutFn;
        /** What the links do as the pointer nears them. */
        computeEffect?: ProximityEffectFn;
        /**
         * Draws one link. It is handed the link's record, whether its section is current together with the
         * interaction state, and the placement for a layout that put it somewhere other than in a run. The record's
         * `depth` is what to indent by. Its text is the link's name.
         */
        renderLink: (
            getLink: Accessor<TableOfContentsLink<T>>,
            getFlags: () => InteractionFlags<TableOfContentsFlags>,
            getPlacement: () => PlacementRect | undefined,
        ) => JSX.Element;
        /**
         * Runs when a different section becomes current, as the reader scrolls or presses a link. It is told
         * `undefined` when the reader scrolls back above the first section.
         */
        onCurrentChange?: (value: T | undefined) => void;
    };
