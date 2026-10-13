import type { VNodeChild } from "vue";

import type { BaseSidebarProps, SidebarPhase } from "@thewaver/ss-components";

export type SidebarContentRenderer = (props: { phase: SidebarPhase; transitionDurationMs: number }) => VNodeChild;

export type SidebarProps = BaseSidebarProps & {
    /**
     * Whether the sidebar is expanded. The owner writes it from a button of their own, anywhere on the page, and
     * nothing else does — the sidebar draws no control. Leave it out and the sidebar stays collapsed unless hovering
     * expands it. Collapsing it while a popup opened from inside is still open waits for that popup to close and the
     * pointer to move away, so the popup is never left hanging off something no longer there. A sidebar that starts
     * expanded appears expanded, without growing into place.
     */
    "expanded"?: boolean;
    /** What `v-model:expanded` binds. The sidebar never calls it, since only the owner expands or collapses it. */
    "onUpdate:expanded"?: (isExpanded: boolean) => void;
};

export type SidebarSlots = {
    /**
     * Draws the sidebar's contents, handed which of the four phases it is in, so a collapsed layout and an expanded
     * one can be swapped at the moment that suits them. Everything drawn stays reachable in every phase, so a layout
     * that is only meant to be seen expanded should be hidden while collapsed.
     *
     * Nothing drawn here is clipped, so a shadow or an outline can fall past the sidebar's edge. The box it is drawn
     * into is always exactly the sidebar's size, mid-transition included; contents laid out at the expanded size
     * have to clip themselves to that box.
     */
    renderContent: SidebarContentRenderer;
};
