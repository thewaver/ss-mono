import type { AccessorProps, DrawerEdge } from "@thewaver/ss-components";

export type DrawerPanelProps = AccessorProps<{
    edge: DrawerEdge;
    visibilityTarget: 0 | 1;
    transitionDurationMs: number;
}>;
