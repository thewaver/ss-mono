import type { DrawerEdge } from "@thewaver/ss-components";

export type BaseDrawerPanelValues = {
    edge: DrawerEdge;
    visibilityTarget: 0 | 1;
    transitionDurationMs: number;
};

export type BaseDrawerPanelProps = BaseDrawerPanelValues;
