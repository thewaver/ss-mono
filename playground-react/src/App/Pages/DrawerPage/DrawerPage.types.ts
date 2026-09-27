import type { DrawerEdge } from "@thewaver/ss-components-react";

export type DrawerExampleProps = {
    edge: DrawerEdge;
    fillers: string[];
    visibilityState: readonly [boolean, (isVisible: boolean) => void];
};
