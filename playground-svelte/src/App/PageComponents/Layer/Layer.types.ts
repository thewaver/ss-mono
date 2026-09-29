import type { Snippet } from "svelte";

import type { LayerLevel } from "./Layer.context.types";

export type PageLayerProps = {
    level: LayerLevel;
    children?: Snippet;
};
