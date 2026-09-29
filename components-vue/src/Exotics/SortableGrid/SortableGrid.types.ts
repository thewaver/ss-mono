import type { VNodeChild } from "vue";

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
    InteractionWrapperSlots,
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

export type SortableGridItemSlotSlots = {
    /** Draws the item body. */
    renderContent: (flags: InteractionFlags<SortableGridItemFlags>) => VNodeChild;
};

export type SortableGridProps<T> = Omit<InteractionWrapperProps<SortableGridFlags>, "extraFlags"> & {
    /**
     * Identifies the grid, so two grids can tell their own items from each other's when something is dragged between
     * them.
     */
    "groupId": string;
    /** Names the grid for assistive technology. */
    "ariaLabel": string;
    /**
     * Everything the grid says aloud while an item is moved, and the key hints and spot names those announcements are
     * built from. There is no default: every word a reader hears comes from here.
     */
    "announcements": SortableGridAnnouncements;
    /** How many cells across the grid is. */
    "columns": number;
    /** How many cells down the grid is. */
    "rows": number;
    /** How large one cell is. */
    "cellSize": number;
    /** The space between cells. */
    "gap"?: number;
    /** Freezes the grid as it stands: items still show, but none can be moved. */
    "isLocked"?: boolean;
    /** Whether an item can be turned on the spot as well as moved. */
    "isTurnable"?: boolean;
    /**
     * Whether a cell is blocked, which is a wall: no item lands on it or overlaps it, an item arriving from elsewhere
     * is put clear of it, the arrow keys step a carried item over it, and `renderCell` is told so it can be drawn.
     * Every cell is open when this is left out.
     */
    "computeIsSpotBlocked"?: (spot: SortableGridSpot) => boolean;
    /** The items and where they sit. It is the only thing that moves them. */
    "items": SortableGridItem<T>[];
    /** Receives the items as they are moved, which is what `v-model:items` binds. */
    "onUpdate:items"?: (items: SortableGridItem<T>[]) => void;
    /** The key one item is told apart by, which is what lets an item keep its identity as it moves. */
    "computeItemKey": (value: T) => string;
    /** Names one item for assistive technology. */
    "computeItemLabel": (value: T) => string;
    /**
     * Whether this grid will take an item offered to it, and from which grid, so a grid can refuse what does not
     * belong.
     */
    "computeCanAccept"?: (value: T, fromLabel: string) => boolean;
    /** Runs when an item is moved, here or to another grid. */
    "onTransfer"?: (transfer: SortableGridTransfer<T>) => void;
    /** Hands the consumer a controller once the grid is up, for moving items from outside. */
    "onMount"?: (controller: SortableGridController) => void;
};

export type SortableGridSlots<T> = Pick<InteractionWrapperSlots<SortableGridFlags>, "renderDecoration"> & {
    /** Draws one item. */
    renderItem: (props: {
        item: SortableGridItem<T>;
        flags: InteractionFlags<SortableGridItemFlags>;
        geometry: SortableGridGeometry;
    }) => VNodeChild;
    /** Draws the item being carried, which follows the pointer rather than sitting in the grid. */
    renderCarried?: (props: { item: SortableGridItem<T>; geometry: SortableGridGeometry }) => VNodeChild;
    /** Draws one empty cell of the grid, told whether it is blocked. */
    renderCell?: (props: { spot: SortableGridSpot; flags: SortableGridCellFlags }) => VNodeChild;
    /** Draws where a carried item would land, and whether landing there is allowed. */
    renderLanding?: (props: { isAllowed: boolean; geometry: SortableGridGeometry }) => VNodeChild;
};
