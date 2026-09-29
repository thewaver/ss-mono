import type { Snippet } from "svelte";
import type { Attachment } from "svelte/attachments";
import type { MosaicItemState, MosaicPackDefs, MosaicPlacement, MosaicState } from "@thewaver/ss-components";
import type { Rect, Size2d } from "@thewaver/ss-utils";
export type { MosaicState };
export type MosaicWalkProps = {
    /**
     * Names the mosaic for assistive technology. Required with {@link MosaicWalkProps.onActivate}, since a
     * set of tiles walked as one stop is announced by this name before any tile is.
     */
    ariaLabel: string;
    /**
     * Runs when a tile is pressed, or activated with Enter or Space, and is told which item it was, counting
     * in the order the items were given. Giving it makes the mosaic a single tab stop: Left and Right walk
     * the reading order, Up and Down go to the tile below or above that overlaps this one the most, and
     * Home and End go to the first and last.
     */
    onActivate: (index: number) => void;
} | {
    /** Only with {@link MosaicWalkProps.onActivate}; a mosaic that is not walked is not a stop to name. */
    ariaLabel?: undefined;
    /** Left out, the mosaic is no tab stop of its own and whatever the tiles hold takes focus as usual. */
    onActivate?: undefined;
};
export type MosaicProps = MosaicState & {
    /**
     * Whether the tiles have sizes of their own that the packing has to honor, rather than being given whatever
     * shape is left.
     */
    isItemSized: boolean;
    /** The size of each tile, where they have their own. */
    sizes: Size2d[];
    /** Packs the tiles, answering with a rectangle each. */
    computePlacements: (defs: MosaicPackDefs) => MosaicPlacement[];
    /**
     * What each tile is, in the order the items were given. A tile keeps its element for as long as its key
     * is in the list, so taking one out moves the others rather than handing each the next one's contents.
     * Left out, a tile is known by its position.
     */
    keys?: unknown[];
    /** Names the mosaic, when it is walked by the arrow keys. */
    ariaLabel?: string;
    /** Makes the mosaic one tab stop walked by the arrow keys, and runs when a tile is activated. */
    onActivate?: (index: number) => void;
    /** Draws one tile, and is told which item it is and how it was placed. */
    renderItem: Snippet<[index: number, state: MosaicItemState]>;
};
export type MosaicTileProps = Pick<MosaicProps, "isItemSized" | "renderItem"> & {
    /** Which item the tile shows, counting in the order the items were given. */
    index: number;
    /** Where the tile falls in reading order. */
    readingIndex: number;
    /** How many items there are. */
    itemCount: number;
    /** The box the tile was packed into, or `undefined` while it is not placed. */
    rect: Rect | undefined;
    /** Whether the mosaic is walked by the arrow keys, which makes the tile a button. */
    isWalked: boolean;
    /** Whether the tile is the mosaic's one tab stop. */
    isTabStop: boolean;
    /** Whether the latest layout came from the tiles changing rather than from the container resizing. */
    isRepack: boolean;
    /** How long a glide to a new box takes. */
    glideDurationMs: number;
    /** Hands the tile's button to the mosaic, so the arrow keys can focus it. */
    attachButton: Attachment<HTMLElement>;
    /** Runs when the tile takes focus or is pressed. */
    onFocusSlot: () => void;
    /** Runs when the tile is activated. */
    onActivate: (index: number) => void;
};
