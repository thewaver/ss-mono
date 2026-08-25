import type { AccessorProps, MosaicSizeAnchor } from "@thewaver/ss-components";

export type PageMosaicTileDefs = {
    name: string;
    width: number;
    height: number;
};

export type ElementMosaicExampleProps = AccessorProps<{
    items: PageMosaicTileDefs[];
    gap: number;
    sizeAnchor: MosaicSizeAnchor;
}>;
