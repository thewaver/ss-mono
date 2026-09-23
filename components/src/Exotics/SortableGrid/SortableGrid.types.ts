import type { Accessor, JSX } from "solid-js";

import type { Index2d, Point2d } from "@thewaver/ss-utils";

import type { CarrierAnnouncements } from "../../Abstracts/Carrier/Carrier.types";
import type { InteractionFlags } from "../../Abstracts/InteractionTracker/InteractionTracker.types";
import type {
    InteractionTooltipDefs,
    InteractionWrapperProps,
} from "../../Primitives/InteractionWrapper/InteractionWrapper.types";
import type { AccessorProps, SignalSource } from "../../Utils/typeUtils";

export type SortableGridSpot = Index2d;

export type SortableGridAnnouncements = CarrierAnnouncements & {
    /** Describes every item while nothing is picked up, telling a keyboard user that Enter picks it up. */
    restingKeyHint: string;
    /** Tells a keyboard user which keys move, drop and cancel a carried item, when there is no other grid to go to. */
    keyHint: string;
    /** The same, for when another grid would take the item too, so the key that moves between grids is mentioned. */
    keyHintAcrossZones: string;
    /**
     * Names a spot in the grid, which is what the pick-up, move and drop announcements say the item is at.
     *
     * @param spot The cell the item's corner would sit in, counting rows and columns from zero.
     * @param hasRoom Whether the item fits there, so a reader is told before dropping that it would be refused.
     */
    computePlaceLabel: (spot: SortableGridSpot, hasRoom: boolean) => string;
};

export type SortableGridSize = {
    rowCount: number;
    colCount: number;
};

export type SortableGridBox = {
    spot: SortableGridSpot;
    size: SortableGridSize;
};

export type SortableGridFootprint = SortableGridSize | SortableGridSpot[];

export type SortableGridShape = {
    cells: SortableGridSpot[];
    size: SortableGridSize;
};

export type SortableGridRect = {
    spot: SortableGridSpot;
    left: number;
    top: number;
    width: number;
    height: number;
};

export type SortableGridGeometry = {
    size: SortableGridSize;
    cells: SortableGridRect[];
    block: SortableGridRect;
    outline: Point2d[];
};

export type SortableGridPlace = SortableGridSpot & {
    turns: number;
};

export type SortableGridItemFlags = {
    isCarried: boolean;
};

export type SortableGridCellFlags = {
    /** Whether nothing may land on this cell, so it can be drawn as a wall. */
    isBlocked: boolean;
};

export type SortableGridFlags = {
    isCarrying: boolean;
    isReceiving: boolean;
    isSource: boolean;
    isEmpty: boolean;
};

export type SortableGridItem<T> = {
    value: T;
    spot: SortableGridSpot;
    footprint: SortableGridFootprint;
    turns?: number;
    isDisabled?: boolean;
    isReachableWhenDisabled?: boolean;
    tooltipDefs?: InteractionTooltipDefs<SortableGridItemFlags>;
};

export type SortableGridTransfer<T> = {
    value: T;
    fromLabel: string;
    toLabel: string;
    fromSpot?: SortableGridSpot;
    toSpot: SortableGridSpot;
};

export type SortableGridController = {
    getIsCarrying: Accessor<boolean>;
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
     * Items keep their column and their turn, and nothing jumps past what is in its way. Called from `onTransfer`
     * it keeps the grid packed after every move; called from a button it tidies up once. Nothing is reported
     * through `onTransfer` for what it moves.
     *
     * @returns `false` when nothing moved, or while an item is being carried out of or into this grid.
     */
    compact: () => boolean;
};

export type SortableGridItemSlotProps = AccessorProps<{
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
    renderContent: (getFlags: () => InteractionFlags<SortableGridItemFlags>) => JSX.Element;
    /** Receives the item element once it exists, so the grid can measure and scroll it. */
    ref?: (element: HTMLElement) => void;
    /** Runs as a press goes down on this item, which is what a drag starts from. */
    onPointerDown: (e: PointerEvent) => void;
    /**
     * Runs on a key pressed while this item has focus, which is what picks it up and puts it down without a pointer.
     */
    onKeyDown: (e: KeyboardEvent) => void;
    /** Runs when this item is clicked. */
    onClick: (e: MouseEvent) => void;
    /** Runs when this item takes focus. */
    onFocus: () => void;
}>;

export type SortableGridProps<T> = Omit<InteractionWrapperProps<SortableGridFlags>, "renderControl" | "extraFlags"> &
    AccessorProps<{
        /**
         * Identifies the grid, so two grids can tell their own items from each other's when something is dragged
         * between them.
         */
        groupId: string;
        /** Names the grid for assistive technology. */
        ariaLabel: string;
        /**
         * Everything the grid says aloud while an item is moved, and the key hints and spot names those
         * announcements are built from. There is no default: every word a reader hears comes from here.
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
         * Whether a cell is blocked, which is a wall: no item lands on it or overlaps it, an item arriving from
         * elsewhere is put clear of it, the arrow keys step a carried item over it, and `renderCell` is told so it
         * can be drawn. Every cell is open when this is left out.
         */
        computeIsSpotBlocked?: (spot: SortableGridSpot) => boolean;
    }> & {
        /** The items and where they sit. It is the only thing that moves them. */
        itemsSignal: SignalSource<SortableGridItem<T>[]>;
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
            getItem: Accessor<SortableGridItem<T>>,
            getFlags: () => InteractionFlags<SortableGridItemFlags>,
            getGeometry: Accessor<SortableGridGeometry>,
        ) => JSX.Element;
        /** Draws the item being carried, which follows the pointer rather than sitting in the grid. */
        renderCarried?: (
            getItem: Accessor<SortableGridItem<T>>,
            getGeometry: Accessor<SortableGridGeometry>,
        ) => JSX.Element;
        /** Draws one empty cell of the grid, told whether it is blocked. */
        renderCell?: (getSpot: Accessor<SortableGridSpot>, getFlags: Accessor<SortableGridCellFlags>) => JSX.Element;
        /** Draws where a carried item would land, and whether landing there is allowed. */
        renderLanding?: (getIsAllowed: () => boolean, getGeometry: Accessor<SortableGridGeometry>) => JSX.Element;
        /** Runs when an item is moved, here or to another grid. */
        onTransfer?: (transfer: SortableGridTransfer<T>) => void;
        /** Hands the consumer a controller once the grid is up, for moving items from outside. */
        onMount?: (controller: SortableGridController) => void;
    };
