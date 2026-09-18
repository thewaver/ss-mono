import type { Accessor, JSX } from "solid-js";

import type { Rect, Size2d } from "@thewaver/ss-utils";

import type { AccessorProps, MaybeAccessor } from "../../Utils/typeUtils";

export type MosaicSizeAnchor = "width" | "height";

export type MosaicPlacement = Rect & {
    index: number;
};

export type MosaicPackDefs = {
    sizes: Size2d[];
    anchoredExtent: number;
    gap: number;
};

export type MosaicItemState = {
    index: number;
    readingIndex: number;
    itemCount: number;
    rect: Rect;
};

export type MosaicState = {
    /** Which side the mosaic takes as given: it fills that one and works the other out from the tiles. */
    sizeAnchor?: MosaicSizeAnchor;
    /** The space between tiles. */
    gap?: number;
};

export type MosaicProps = AccessorProps<
    MosaicState & {
        /**
         * Whether the tiles have sizes of their own that the packing has to honour, rather than being given whatever
         * shape is left.
         */
        isItemSized: boolean;
        /** The size of each tile, where they have their own. */
        sizes: Size2d[];
        /** Packs the tiles, answering with a rectangle each. */
        computePlacements: (defs: MosaicPackDefs) => MosaicPlacement[];
        /** Draws one tile, and is told how it was placed. */
        renderItem: (index: number, getState: Accessor<MosaicItemState>) => JSX.Element;
    }
>;

export type MosaicImageSource = {
    src: string;
    alt: string;
};

export type ImageMosaicProps = AccessorProps<
    MosaicState & {
        /** The pictures to pack. */
        sources: MosaicImageSource[];
        /** The shape the mosaic aims to come out as. */
        targetAspectRatio?: Size2d;
        /** Draws one tile. The picture is handed in rather than built, so the consumer decides what surrounds it. */
        renderItem?: (renderImage: () => JSX.Element, getState: Accessor<MosaicItemState>) => JSX.Element;
    }
>;

export type ElementMosaicProps<T> = AccessorProps<MosaicState> & {
    /** The items to pack. */
    items: MaybeAccessor<T[]>;
    /** Draws one item, and is told how it was placed. */
    renderItem: (getItem: Accessor<T>, getState: Accessor<MosaicItemState>) => JSX.Element;
};
