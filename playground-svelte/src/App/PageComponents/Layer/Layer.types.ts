import type { Snippet } from "svelte";

import type { LayerLevel } from "./Layer.contextSvelte.types";

export type PageLayerProps = {
    level: LayerLevel;
    children?: Snippet;
};
