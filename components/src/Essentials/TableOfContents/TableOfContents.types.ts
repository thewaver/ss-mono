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
