export type SidebarEdge = "left" | "right" | "top" | "bottom";

export type SidebarLayout = "push" | "overlay";

export type SidebarPhase = "collapsed" | "expanding" | "expanded" | "collapsing";

export type BaseSidebarValues = {
    /**
     * The sidebar's id. Give one whenever a button of yours opens and closes it, so the button can point at it with
     * `aria-controls`.
     */
    id?: string;
    /**
     * Which side of whatever it sits beside the sidebar is docked to, and so which way it grows. Docked to the top
     * or bottom it spans the full width and grows in height.
     */
    edge?: SidebarEdge;
    /**
     * Whether growing moves the content beside it out of the way, or grows over that content and leaves it where it
     * was. Overlaid, the sidebar only ever takes up its collapsed size in the layout.
     */
    layout?: SidebarLayout;
    /**
     * How far the sidebar reaches out from its edge while collapsed, in pixels: its width docked to the left or right,
     * its height docked to the top or bottom.
     */
    collapsedSize: number;
    /** How far the sidebar reaches out from its edge while expanded, in pixels, measured as `collapsedSize` is. */
    expandedSize: number;
    /** How long the sidebar takes to grow and shrink. */
    transitionDurationMs?: number;
    /**
     * Expands the sidebar while the pointer rests on it, and collapses it again when the pointer leaves or Escape is
     * pressed. It never writes `expanded`, so a sidebar the owner has expanded stays expanded, and one expanded
     * by hover reads as collapsed there. While something opened from inside it is still open elsewhere on the page —
     * a popup, a menu — leaving does not collapse it, so the pointer can reach that popup; the next move outside once
     * it has closed does. Collapsed by the owner while the pointer is on it — a collapse button inside the sidebar —
     * it does not expand again by hover until the pointer has left it once, so the press is not undone by the hover
     * it was made with.
     */
    isExpandedOnHover?: boolean;
    /** How long the pointer has to rest on the sidebar before hovering expands it. */
    hoverShowDelayMs?: number;
};

export type BaseSidebarProps = BaseSidebarValues;
