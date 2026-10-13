import type { AccessorProps } from "@thewaver/ss-components-solid";

import type { LayerLevel } from "./Layer.contextSolid.types";

export type PageLayerProps = AccessorProps<{
    level: LayerLevel;
}>;
