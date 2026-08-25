import type { Signal } from "solid-js";

import type { AccessorProps, DrawerEdge } from "@thewaver/ss-components";

export type DrawerExampleProps = AccessorProps<{
    edge: DrawerEdge;
    fillers: string[];
    visibilitySignal: Signal<boolean>;
}>;
