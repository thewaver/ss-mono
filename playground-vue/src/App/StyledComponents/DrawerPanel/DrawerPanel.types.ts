import type { DrawerEdge } from "@thewaver/ss-components-vue";

export type DrawerPanelProps = {
    edge: DrawerEdge;
    visibilityTarget: 0 | 1;
    transitionDurationMs: number;
};
