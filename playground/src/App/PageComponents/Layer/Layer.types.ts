import type { AccessorProps } from "@thewaver/ss-components";

import type { LayerLevel } from "./Layer.context.types";

export type PageLayerProps = AccessorProps<{
    level: LayerLevel;
}>;
