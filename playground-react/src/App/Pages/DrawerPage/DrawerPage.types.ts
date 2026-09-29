import type { DrawerEdge } from "@thewaver/ss-components-react";

export type DrawerExampleProps = {
    edge: DrawerEdge;
    fillers: string[];
    visibility: readonly [boolean, (isVisible: boolean) => void];
};
