import type { KeyboardEvent, MouseEvent, PointerEvent, ReactNode } from "react";

import type {
    InteractionFlags,
    SortableGridAnnouncements,
    SortableGridCellFlags,
    SortableGridFlags,
    SortableGridGeometry,
    SortableGridItemFlags,
    SortableGridItemRecord,
    SortableGridRect,
    SortableGridSpot,
    SortableGridTransfer,
} from "@thewaver/ss-components";

import type {
    InteractionTooltipDefs,
    InteractionWrapperProps,
} from "../../Primitives/InteractionWrapper/InteractionWrapper.types";

export type SortableGridItem<T> = SortableGridItemRecord<T, InteractionTooltipDefs<SortableGridItemFlags>>;

export type SortableGridController = {
    /** Whether an item picked up from this grid is being carried, which is when a turn button has anything to do. */
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
    /**
     * Calls `listener` whenever what `getIsCarrying` reports has changed, until the returned function is called. The
     * getter answers with what the grid last drew, so this and the getter are what `useSyncExternalStore` takes —
     * which is how a consumer's turn button follows the carry.
     */
    subscribe: (listener: () => void) => () => void;
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
    renderContent: (flags: InteractionFlags<SortableGridItemFlags>) => ReactNode;
    /** Receives the item element once it exists, so the grid can measure and scroll it. */
    ref?: (element: HTMLElement | null) => void;
    /** Runs as a press goes down on this item, which is what a drag starts from. */
    onPointerDown: (e: PointerEvent<HTMLDivElement>) => void;
    /**
     * Runs on a key pressed while this item has focus, which is what picks it up and puts it down without a pointer.
     */
    onKeyDown: (e: KeyboardEvent<HTMLDivElement>) => void;
    /** Runs when this item is clicked. */
    onClick: (e: MouseEvent<HTMLDivElement>) => void;
    /** Runs when this item takes focus. */
    onFocus: () => void;
};

export type SortableGridProps<T> = Omit<InteractionWrapperProps<SortableGridFlags>, "renderControl" | "extraFlags"> & {
    /**
     * Identifies the grid, so two grids can tell their own items from each other's when something is dragged between
     * them.
     */
    groupId: string;
    /** Names the grid for assistive technology. */
    ariaLabel: string;
    /**
     * Everything the grid says aloud while an item is moved, and the key hints and spot names those announcements are
     * built from. There is no default: every word a reader hears comes from here.
     */
    announcements: SortableGridAnnouncements;
    /** How many cells across the grid is. */
    columns: number;
    /** How many cells down the grid is. */
    rows: number;
    /** How large one cell is. */
    cellSize: number;
    /** The space between cells. */
    gap?: number;
    /** Freezes the grid as it stands: items still show, but none can be moved. */
    isLocked?: boolean;
    /** Whether an item can be turned on the spot as well as moved. */
    isTurnable?: boolean;
    /**
     * Whether a cell is blocked, which is a wall: no item lands on it or overlaps it, an item arriving from elsewhere
     * is put clear of it, the arrow keys step a carried item over it, and `renderCell` is told so it can be drawn.
     * Every cell is open when this is left out.
     */
    computeIsSpotBlocked?: (spot: SortableGridSpot) => boolean;
    /** The items and where they sit. It is the only thing that moves them. */
    itemsState: readonly [SortableGridItem<T>[], (items: SortableGridItem<T>[]) => void];
    /** The key one item is told apart by, which is what lets an item keep its identity as it moves. */
    computeItemKey: (value: T) => string;
    /** Names one item for assistive technology. */
    computeItemLabel: (value: T) => string;
    /**
     * Whether this grid will take an item offered to it, and from which grid, so a grid can refuse what does not
     * belong.
     */
    computeCanAccept?: (value: T, fromLabel: string) => boolean;
    /** Draws one item. */
    renderItem: (
        item: SortableGridItem<T>,
        flags: InteractionFlags<SortableGridItemFlags>,
        geometry: SortableGridGeometry,
    ) => ReactNode;
    /** Draws the item being carried, which follows the pointer rather than sitting in the grid. */
    renderCarried?: (item: SortableGridItem<T>, geometry: SortableGridGeometry) => ReactNode;
    /** Draws one empty cell of the grid, told whether it is blocked. */
    renderCell?: (spot: SortableGridSpot, flags: SortableGridCellFlags) => ReactNode;
    /** Draws where a carried item would land, and whether landing there is allowed. */
    renderLanding?: (isAllowed: boolean, geometry: SortableGridGeometry) => ReactNode;
    /** Runs when an item is moved, here or to another grid. */
    onTransfer?: (transfer: SortableGridTransfer<T>) => void;
    /** Hands the consumer a controller once the grid is up, for moving items from outside. */
    onMount?: (controller: SortableGridController) => void;
};
