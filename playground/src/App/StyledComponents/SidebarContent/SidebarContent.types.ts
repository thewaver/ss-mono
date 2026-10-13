import type { SidebarEdge, SidebarPhase } from "@thewaver/ss-components";

export type BaseSidebarFrameValues = {
    edge: SidebarEdge;
};

export type BaseSidebarFrameProps = BaseSidebarFrameValues;

export type BaseSidebarSurfaceValues = {
    width: number;
};

export type BaseSidebarSurfaceProps = BaseSidebarSurfaceValues;

export type BaseSidebarFadeValues = {
    phase: SidebarPhase;
    transitionDurationMs: number;
};

export type BaseSidebarFadeProps = BaseSidebarFadeValues;
