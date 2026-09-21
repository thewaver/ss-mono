import type { Accessor, JSX } from "solid-js";

import type { Rect, Size2d } from "@thewaver/ss-utils";

import type { AccessorProps, MaybeAccessor } from "../../Utils/typeUtils";

export type MosaicSizeAnchor = "width" | "height";

export type MosaicPlacement = Rect & {
    /** Which item this box belongs to, counting from zero in the order the items were given. */
    index: number;
};

export type MosaicPackDefs = {
    /** Each item's measured size, in the order the items were given. An unmeasured item is zero by zero. */
    sizes: Size2d[];
    /** How much room there is across the anchored axis, which is the one the packing has to fit. */
    anchoredExtent: number;
    /** The space to leave between boxes. */
    gap: number;
};

export type MosaicItemState = {
    /** Which item this is, counting from zero in the order the items were given. */
    index: number;
    /** Where this item falls when the mosaic is read left to right and top to bottom, which is not the order it was given in. */
    readingIndex: number;
    /** How many items there are. */
    itemCount: number;
    /** The box this item was packed into. */
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
         * Whether the tiles have sizes of their own that the packing has to honor, rather than being given whatever
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
