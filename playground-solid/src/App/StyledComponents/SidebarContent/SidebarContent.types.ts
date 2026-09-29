import type { AccessorProps, SidebarEdge, SidebarPhase } from "@thewaver/ss-components-solid";

export type SidebarFrameProps = AccessorProps<{
    edge: SidebarEdge;
}>;

export type SidebarSurfaceProps = AccessorProps<{
    width: number;
}>;

export type SidebarFadeProps = AccessorProps<{
    phase: SidebarPhase;
    transitionDurationMs: number;
}>;
