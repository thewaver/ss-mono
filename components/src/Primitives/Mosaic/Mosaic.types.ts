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

export type BaseMosaicWalkProps<TLabel = string> =
    | {
          /**
           * Names the mosaic for assistive technology. Required with {@link BaseMosaicWalkProps.onActivate}, since a
           * set of tiles walked as one stop is announced by this name before any tile is.
           */
          ariaLabel: TLabel;
          /**
           * Runs when a tile is pressed, or activated with Enter or Space, and is told which item it was, counting
           * in the order the items were given. Giving it makes the mosaic a single tab stop: Left and Right walk
           * the reading order, Up and Down go to the tile below or above that overlaps this one the most, and
           * Home and End go to the first and last.
           */
          onActivate: (index: number) => void;
      }
    | {
          /** Only with {@link BaseMosaicWalkProps.onActivate}; a mosaic that is not walked is not a stop to name. */
          ariaLabel?: undefined;
          /** Left out, the mosaic is no tab stop of its own and whatever the tiles hold takes focus as usual. */
          onActivate?: undefined;
      };

export type BaseMosaicValues = MosaicState & {
    /**
     * Whether the tiles have sizes of their own that the packing has to honor, rather than being given whatever
     * shape is left.
     */
    isItemSized: boolean;
    /** The size of each tile, where they have their own. */
    sizes: Size2d[];
    /**
     * What each tile is, in the order the items were given. A tile keeps its element for as long as its key
     * is in the list, so taking one out moves the others rather than handing each the next one's contents.
     * Left out, a tile is known by its position.
     */
    keys?: unknown[];
    /** Names the mosaic, when it is walked by the arrow keys. */
    ariaLabel?: string;
};

export type BaseMosaicCbs = {
    /** Packs the tiles, answering with a rectangle each. */
    computePlacements: (defs: MosaicPackDefs) => MosaicPlacement[];
    /** Makes the mosaic one tab stop walked by the arrow keys, and runs when a tile is activated. */
    onActivate?: (index: number) => void;
};

export type BaseMosaicProps = BaseMosaicValues & BaseMosaicCbs;
