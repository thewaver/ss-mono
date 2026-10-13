import type { Snippet } from "svelte";
import type { Attachment } from "svelte/attachments";

import type { BaseMosaicProps, BaseMosaicWalkProps, MosaicItemState, MosaicState } from "@thewaver/ss-components";
import type { Rect } from "@thewaver/ss-utils";

export type { MosaicState };

export type MosaicWalkProps = BaseMosaicWalkProps;

export type MosaicProps = BaseMosaicProps & {
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
