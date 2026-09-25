import type { JSX } from "solid-js";

import type { AccessorProps, SignalSource } from "../../Utils/typeUtils";

export type SidebarEdge = "left" | "right";

export type SidebarLayout = "push" | "overlay";

export type SidebarPhase = "collapsed" | "expanding" | "expanded" | "collapsing";

export type SidebarContentRenderer = (
    getPhase: () => SidebarPhase,
    getTransitionDurationMs: () => number,
) => JSX.Element;

export type SidebarProps = AccessorProps<{
    /**
     * The sidebar's id. Give one whenever a button of yours opens and closes it, so the button can point at it
     * with `aria-controls`.
     */
    id?: string;
    /** Which side of whatever it sits beside the sidebar is docked to, and so which way it grows. */
    edge?: SidebarEdge;
    /**
     * Whether growing moves the content beside it out of the way, or grows over that content and leaves it where
     * it was. Overlaid, the sidebar only ever takes up its collapsed width in the layout.
     */
    layout?: SidebarLayout;
    /** How wide the sidebar is while collapsed, in pixels. */
    collapsedWidth: number;
    /** How wide the sidebar is while expanded, in pixels. */
    expandedWidth: number;
    /** How long the sidebar takes to grow and shrink. */
    transitionDurationMs?: number;
    /**
     * Expands the sidebar while the pointer rests on it, and collapses it again when the pointer leaves or Escape
     * is pressed. It never writes `expandedSignal`, so a sidebar the owner has expanded stays expanded, and one
     * expanded by hover reads as collapsed there. While something opened from inside it is still open elsewhere
     * on the page — a popup, a menu — leaving does not collapse it, so the pointer can reach that popup; the next
     * move outside once it has closed does.
     */
    isExpandedOnHover?: boolean;
    /** How long the pointer has to rest on the sidebar before hovering expands it. */
    hoverShowDelayMs?: number;
    /**
     * Whether the sidebar is expanded. Both sides write it: the owner from a button of their own, anywhere on the
     * page, and nothing else — the sidebar draws no control. Leave it out and the sidebar stays collapsed unless
     * hovering expands it. Collapsing it while a popup opened from inside is still open waits for that popup to
     * close and the pointer to move away, so the popup is never left hanging off something no longer there. A
     * sidebar that starts expanded appears expanded, without growing into place.
     */
    expandedSignal?: SignalSource<boolean>;
    /**
     * Draws the sidebar's contents, handed which of the four phases it is in, so a collapsed layout and an
     * expanded one can be swapped at the moment that suits them. Everything drawn stays reachable in every phase,
     * so a layout that is only meant to be seen expanded should be hidden while collapsed.
     *
     * Nothing drawn here is clipped, so a shadow or an outline can fall past the sidebar's edge. The box it is
     * drawn into is always exactly as wide as the sidebar, mid-transition included; contents laid out at the
     * expanded width have to clip themselves to that box.
     */
    renderContent: SidebarContentRenderer;
}>;
