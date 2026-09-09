import type { Accessor } from "solid-js";

import type { BandDefs } from "@thewaver/ss-components";

export type PlacementExampleProps = {
    getLayoutDefs: Accessor<BandDefs>;
};
