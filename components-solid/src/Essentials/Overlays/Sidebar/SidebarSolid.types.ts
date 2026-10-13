import type { JSX } from "solid-js";

import type { BaseSidebarValues, SidebarPhase } from "@thewaver/ss-components";

import type { AccessorProps, AccessorValues, SignalSource } from "../../../Utils/typeUtils";

export type SidebarContentRenderer = (
    getPhase: () => SidebarPhase,
    getTransitionDurationMs: () => number,
) => JSX.Element;

export type SidebarProps = AccessorValues<BaseSidebarValues> &
    AccessorProps<{
        /**
         * Whether the sidebar is expanded. Both sides write it: the owner from a button of their own, anywhere on the
         * page, and nothing else — the sidebar draws no control. Leave it out and the sidebar stays collapsed unless
         * hovering expands it. Collapsing it while a popup opened from inside is still open waits for that popup to
         * close and the pointer to move away, so the popup is never left hanging off something no longer there. A
         * sidebar that starts expanded appears expanded, without growing into place.
         */
        expanded?: SignalSource<boolean>;
        /**
         * Draws the sidebar's contents, handed which of the four phases it is in, so a collapsed layout and an
         * expanded one can be swapped at the moment that suits them. Everything drawn stays reachable in every phase,
         * so a layout that is only meant to be seen expanded should be hidden while collapsed.
         *
         * Nothing drawn here is clipped, so a shadow or an outline can fall past the sidebar's edge. The box it is
         * drawn into is always exactly the sidebar's size, mid-transition included; contents laid out at the
         * expanded size have to clip themselves to that box.
         */
        renderContent: SidebarContentRenderer;
    }>;
