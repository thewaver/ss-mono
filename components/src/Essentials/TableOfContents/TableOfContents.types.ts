import type { PlacementLayoutFn } from "../../Abstracts/Placement/Placement.types";
import type { ProximityEffectFn } from "../../Abstracts/Proximity/Proximity.types";

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

export type BaseTableOfContentsValues<T> = TableOfContentsNameProps & {
    /** Whether the links run down the page or across it. */
    orientation?: TableOfContentsOrientation;
    /** The space between links. */
    gap?: number;
    /**
     * How far down the line sits that decides which section is current, as a share of the visible height of the box
     * the targets scroll in — their nearest scrolling ancestor, or the page itself when there is none. A section
     * becomes current once its target's top has scrolled above the line. Once that box is scrolled as far as it goes,
     * the last section whose target is on screen is current instead, so short sections at the end are reached too. A
     * pressed link is current until the reader scrolls, presses a key or presses anywhere else.
     */
    offsetRatio?: number;
    /**
     * The links, in reading order. The list stays flat for the keyboard and for a screen reader whatever depths the
     * records carry.
     */
    links: TableOfContentsLink<T>[];
};

export type BaseTableOfContentsCbs<T> = {
    /** Arranges the links, for a list that is something other than a straight run. */
    computeLayout?: PlacementLayoutFn;
    /** What the links do as the pointer nears them. */
    computeEffect?: ProximityEffectFn;
    /**
     * Runs when a different section becomes current, as the reader scrolls or presses a link. It is told `undefined`
     * when the reader scrolls back above the first section.
     */
    onCurrentChange?: (value: T | undefined) => void;
};

export type BaseTableOfContentsProps<T> = BaseTableOfContentsValues<T> & BaseTableOfContentsCbs<T>;
