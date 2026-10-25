import type { SidebarEdge, SidebarLayout } from "@thewaver/ss-components";

export type BaseSidebarBasicDocsExampleValues = {
    edge: SidebarEdge;
    transitionDurationMs: number;
};

export type BaseSidebarOverlayDocsExampleValues = {
    layout: SidebarLayout;
};

export type BaseSidebarHoverDocsExampleValues = {
    isExpandedOnHover: boolean;
    hoverShowDelayMs: number;
};
