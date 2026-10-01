import type { SidebarEdge, SidebarLayout } from "./Sidebar.types";

export const SIDEBAR_EDGES: readonly SidebarEdge[] = ["left", "right", "top", "bottom"];

export const SIDEBAR_LAYOUTS: readonly SidebarLayout[] = ["push", "overlay"];

export const SIDEBAR_SIZE_PROPERTIES: Record<SidebarEdge, "width" | "height"> = {
    left: "width",
    right: "width",
    top: "height",
    bottom: "height",
};

export const SIDEBAR_DEFAULTS = {
    edge: "left" as SidebarEdge,
    layout: "push" as SidebarLayout,
    transitionDurationMs: 200,
    hoverShowDelayMs: 300,
};
