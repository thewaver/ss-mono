import type { Snippet } from "svelte";

import type {
    InteractionFlags,
    PlacementLayoutFn,
    PlacementRect,
    ProximityEffectFn,
    TableOfContentsFlags,
    TableOfContentsLink,
    TableOfContentsOrientation,
} from "@thewaver/ss-components";

import type { InteractionControlProps } from "../../Primitives/InteractionWrapper/InteractionWrapper.types.js";

export type TableOfContentsItemProps<T> = Omit<InteractionControlProps<TableOfContentsFlags>, "id"> & {
    /** The link this item stands for. */
    link: TableOfContentsLink<T>;
};

export type TableOfContentsNameProps =
    | {
          /**
           * Names the list for assistive technology. One of this and `ariaLabelledBy` is required, because the `<nav>`
           * around the links is a landmark, and a page holding it beside its own site navigation gives a reader no way
           * to tell two unnamed ones apart.
           */
          ariaLabel: string;
          ariaLabelledBy?: undefined;
      }
    | {
          ariaLabel?: undefined;
          /**
           * Points at the element whose text names the list, for a table of contents that already shows its own title.
           * One of this and `ariaLabel` is required, because the `<nav>` around the links is a landmark and an unnamed
           * one cannot be told apart from the site's own.
           */
          ariaLabelledBy: string;
      };

export type TableOfContentsProps<T> = TableOfContentsNameProps & {
    /** Whether the links run down the page or across it. */
    orientation?: TableOfContentsOrientation;
    /** The space between links. */
    gap?: number;
    /**
     * How far down the viewport the line sits that decides which section is current, as a share of its height. A
     * section becomes current once its target's top has scrolled above the line.
     */
    offsetRatio?: number;
    /**
     * The links, in reading order. The list stays flat for the keyboard and for a screen reader whatever depths the
     * records carry.
     */
    links: TableOfContentsLink<T>[];
    /** Arranges the links, for a list that is something other than a straight run. */
    computeLayout?: PlacementLayoutFn;
    /** What the links do as the pointer nears them. */
    computeEffect?: ProximityEffectFn;
    /**
     * Draws one link. It is handed the link's record, whether its section is current together with the interaction
     * state, and the placement for a layout that put it somewhere other than in a run. The record's `depth` is what to
     * indent by. Its text is the link's name.
     */
    renderLink: Snippet<
        [
            link: TableOfContentsLink<T>,
            flags: InteractionFlags<TableOfContentsFlags>,
            placement: PlacementRect | undefined,
        ]
    >;
    /**
     * Runs when a different section becomes current, as the reader scrolls or presses a link. It is told `undefined`
     * when the reader scrolls back above the first section.
     */
    onCurrentChange?: (value: T | undefined) => void;
};
