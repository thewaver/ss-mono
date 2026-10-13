import type { Index2d, Point2d } from "@thewaver/ss-utils";

import type { CarrierAnnouncements, CarrierZone } from "../../Abstracts/Carrier/Carrier.types";

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
    contour: Point2d[];
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

export type SortableGridItemRecord<T, TTooltipDefs> = {
    value: T;
    spot: SortableGridSpot;
    footprint: SortableGridFootprint;
    turns?: number;
    isDisabled?: boolean;
    isReachableWhenDisabled?: boolean;
    tooltipDefs?: TTooltipDefs;
};

export type SortableGridPickUp = {
    grabOffset: Point2d;
    grabSpot: SortableGridSpot;
    point: Point2d | undefined;
};

export type SortableGridZoneDefs<T, TTooltipDefs> = {
    getZone: () => CarrierZone;
    getItems: () => SortableGridItemRecord<T, TTooltipDefs>[];
    updateItems: (
        update: (items: SortableGridItemRecord<T, TTooltipDefs>[]) => SortableGridItemRecord<T, TTooltipDefs>[],
    ) => void;
    getGroupId: () => string;
    getLabel: () => string;
    getRootRef: () => HTMLElement | undefined;
    getIsDisabled: () => boolean;
    getIsLocked: () => boolean;
    getIsTurnable: () => boolean;
    getAnnouncements: () => SortableGridAnnouncements;
    getColumns: () => number;
    getRows: () => number;
    getCellSize: () => number;
    getGap: () => number;
    getScale: () => number;
    getBlockedSpots: () => SortableGridSpot[];
    computeItemKey: (value: T) => string;
    computeCanAccept?: (value: T, fromLabel: string) => boolean;
    onTransfer?: (transfer: SortableGridTransfer<T>) => void;
};

export type SortableGridTransfer<T> = {
    value: T;
    fromLabel: string;
    toLabel: string;
    fromSpot?: SortableGridSpot;
    toSpot: SortableGridSpot;
};

export type BaseSortableGridValues = {
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
};

export type BaseSortableGridCbs<T> = {
    /**
     * Whether a cell is blocked, which is a wall: no item lands on it or overlaps it, an item arriving from elsewhere
     * is put clear of it, the arrow keys step a carried item over it, and `renderCell` is told so it can be drawn.
     * Every cell is open when this is left out.
     */
    computeIsSpotBlocked?: (spot: SortableGridSpot) => boolean;
    /** The key one item is told apart by, which is what lets an item keep its identity as it moves. */
    computeItemKey: (value: T) => string;
    /** Names one item for assistive technology. */
    computeItemLabel: (value: T) => string;
    /**
     * Whether this grid will take an item offered to it, and from which grid, so a grid can refuse what does not
     * belong.
     */
    computeCanAccept?: (value: T, fromLabel: string) => boolean;
    /** Runs when an item is moved, here or to another grid. */
    onTransfer?: (transfer: SortableGridTransfer<T>) => void;
};

export type BaseSortableGridProps<T> = BaseSortableGridValues & BaseSortableGridCbs<T>;
