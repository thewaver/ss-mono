import type { Rect, Size2d } from "@thewaver/ss-utils";

export type MosaicSizeAnchor = "width" | "height";

export type MosaicStep = "previous" | "next" | "up" | "down" | "first" | "last";

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
    /**
     * Whether this tile holds keyboard focus and the browser would advertise it, which is when a ring belongs on
     * it. Only ever `true` in a mosaic walked by the arrow keys, since otherwise the tile is not what takes focus.
     */
    isFocusVisible: boolean;
};

export type MosaicState = {
    /** Which side the mosaic takes as given: it fills that one and works the other out from the tiles. */
    sizeAnchor?: MosaicSizeAnchor;
    /** The space between tiles. */
    gap?: number;
    /**
     * How long a tile takes to glide from where it was packed to where it is packed now, when a tile is added,
     * taken out or changes size. `0`, the default, moves it at once. The mosaic's own container resizing never
     * glides, and under reduced motion every tile jumps.
     */
    transitionDurationMs?: number;
};

export type MosaicImageSource = {
    src: string;
    alt: string;
};

export type MosaicLayout = {
    placements: MosaicPlacement[];
    freeExtent: number;
    anchoredExtent: number;
};
