import type { SidebarEdge, SidebarLayout } from "./Sidebar.types";

export const SIDEBAR_EDGES: readonly SidebarEdge[] = ["left", "right"];

export const SIDEBAR_LAYOUTS: readonly SidebarLayout[] = ["push", "overlay"];

export const SIDEBAR_DEFAULTS = {
    edge: "left" as SidebarEdge,
    layout: "push" as SidebarLayout,
    transitionDurationMs: 200,
    hoverShowDelayMs: 300,
};
