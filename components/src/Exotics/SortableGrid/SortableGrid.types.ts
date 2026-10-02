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
