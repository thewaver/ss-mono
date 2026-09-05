import type { AccessorProps, MosaicSizeAnchor } from "@thewaver/ss-components";

import type { PageMosaicTileDefs } from "../Mosaics.types";

export type ElementsExampleProps = AccessorProps<{
    items: PageMosaicTileDefs[];
    gap: number;
    sizeAnchor: MosaicSizeAnchor;
}>;
