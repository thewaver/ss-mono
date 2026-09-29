import type { SidebarEdge, SidebarPhase } from "@thewaver/ss-components-vue";

export type SidebarFrameProps = {
    edge: SidebarEdge;
};

export type SidebarSurfaceProps = {
    width: number;
};

export type SidebarFadeProps = {
    phase: SidebarPhase;
    transitionDurationMs: number;
};
