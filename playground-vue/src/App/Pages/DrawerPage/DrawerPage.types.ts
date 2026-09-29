import type { DrawerEdge } from "@thewaver/ss-components-vue";

export type DrawerExampleProps = {
    "edge": DrawerEdge;
    "fillers": string[];
    "visibility": boolean;
    "onUpdate:visibility"?: (isVisible: boolean) => void;
};
