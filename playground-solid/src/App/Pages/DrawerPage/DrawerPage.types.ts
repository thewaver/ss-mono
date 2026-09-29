import type { Signal } from "solid-js";

import type { AccessorProps, DrawerEdge } from "@thewaver/ss-components-solid";

export type DrawerExampleProps = AccessorProps<{
    edge: DrawerEdge;
    fillers: string[];
    visibility: Signal<boolean>;
}>;
