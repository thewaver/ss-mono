import type { Snippet } from "svelte";
import type { Attachment } from "svelte/attachments";

import type {
    BaseSortableGridProps,
    InteractionFlags,
    SortableGridCellFlags,
    SortableGridFlags,
    SortableGridGeometry,
    SortableGridItemFlags,
    SortableGridItemRecord,
    SortableGridRect,
    SortableGridSpot,
} from "@thewaver/ss-components";

import type {
    InteractionTooltipDefs,
    InteractionWrapperProps,
} from "../../Primitives/InteractionWrapper/InteractionWrapper.types.js";

export type SortableGridItem<T> = SortableGridItemRecord<T, InteractionTooltipDefs<SortableGridItemFlags>>;

export type SortableGridController = {
    /**
     * Whether an item picked up from this grid is being carried, which is when a turn button has anything to do. Read
     * inside an effect, a `$derived` or markup, it is followed as carries start and end, which is how a consumer's
     * turn button keeps up with it.
     */
    getIsCarrying: () => boolean;
    /**
     * Turns the block being carried a quarter turn clockwise.
     *
     * @returns `false` when nothing is being carried, or when the block cannot be turned.
     */
    turnCw: () => boolean;
    /**
     * Turns the block being carried a quarter turn counter-clockwise.
     *
     * @returns `false` when nothing is being carried, or when the block cannot be turned.
     */
    turnCcw: () => boolean;
    /**
     * Pulls every item straight up as far as it will slide, stopping at other items and at blocked cells.
     *
     * Items keep their column and their turn, and nothing jumps past what is in its way. Called from `onTransfer` it
     * keeps the grid packed after every move; called from a button it tidies up once. Nothing is reported through
     * `onTransfer` for what it moves.
     *
     * @returns `false` when nothing moved, or while an item is being carried out of or into this grid.
     */
    compact: () => boolean;
};

export type SortableGridItemSlotProps = {
    /** Identifies this item, so the grid can point focus at it. */
    id: string;
    /** Points the item at the grid's resting key hint, so a reader hears how to pick it up. */
    hintId: string;
    /** Names this item for assistive technology. */
    label: string;
    /** This item's place among the items, counting from one. */
    position: number;
    /** How many items there are, so a reader can be told it is the third of five. */
    setSize: number;
    /** The cells this item covers, for an item larger than one square. */
    cells: SortableGridRect[];
    /** This item's interaction state, handed down so the painted part can answer to it. */
    flags: InteractionFlags<SortableGridItemFlags>;
    /** Draws the item body. */
    renderContent: Snippet<[flags: InteractionFlags<SortableGridItemFlags>]>;
    /** Hands the item element to the wrapper around it, which is what the grid measures and focuses. */
    attachElement?: Attachment<HTMLElement>;
    /** Runs as a press goes down on this item, which is what a drag starts from. */
    onPointerDown: (e: PointerEvent) => void;
    /**
     * Runs on a key pressed while this item has focus, which is what picks it up and puts it down without a pointer.
     */
    onKeyDown: (e: KeyboardEvent) => void;
    /** Runs when this item is clicked. */
    onClick: (e: MouseEvent) => void;
    /** Runs when this item, or anything inside it, takes focus. */
    onFocus: () => void;
};

export type SortableGridProps<T> = Omit<InteractionWrapperProps<SortableGridFlags>, "renderControl" | "extraFlags"> &
    BaseSortableGridProps<T> & {
        /**
         * The items and where they sit. Bind it with `bind:items`: it is the only thing that moves them, and the grid
         * writes it when an item is moved.
         */
        items: SortableGridItem<T>[];
        /** Draws one item. */
        renderItem: Snippet<
            [item: SortableGridItem<T>, flags: InteractionFlags<SortableGridItemFlags>, geometry: SortableGridGeometry]
        >;
        /** Draws the item being carried, which follows the pointer rather than sitting in the grid. */
        renderCarried?: Snippet<[item: SortableGridItem<T>, geometry: SortableGridGeometry]>;
        /** Draws one empty cell of the grid, told whether it is blocked. */
        renderCell?: Snippet<[spot: SortableGridSpot, flags: SortableGridCellFlags]>;
        /** Draws where a carried item would land, and whether landing there is allowed. */
        renderLanding?: Snippet<[isAllowed: boolean, geometry: SortableGridGeometry]>;
        /** Hands the consumer a controller once the grid is up, for moving items from outside. */
        onMount?: (controller: SortableGridController) => void;
    };
