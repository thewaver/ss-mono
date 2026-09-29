import type { Point2d, Size2d } from "@thewaver/ss-utils";

import type { CarrierAnnouncements, CarryNudge, CarryOrientation } from "../../Abstracts/Carrier/Carrier.types";
import type { NavigatorDirection } from "../../Abstracts/Navigator/Navigator.types";
import type { PlacementLayout } from "../../Abstracts/Placement/Placement.types";

export type SortableOrientation = CarryOrientation;

export type SortableItemFlags = {
    isCarried: boolean;
    isLandingBefore: boolean;
};

export type SortableFlags = {
    isCarrying: boolean;
    isReceiving: boolean;
    isSource: boolean;
    isEmpty: boolean;
};

export type SortableItemRecord<T, TTooltipDefs> = {
    value: T;
    isDisabled?: boolean;
    isReachableWhenDisabled?: boolean;
    tooltipDefs?: TTooltipDefs;
};

export type SortablePickUp = {
    size: Size2d;
    grabOffset: Point2d;
    point: Point2d | undefined;
};

export type SortableKeyAction =
    | { kind: "cancel" }
    | { kind: "drop" }
    | { kind: "pickUp" }
    | { kind: "aimAtNextZone"; step: number }
    | { kind: "nudge"; nudge: CarryNudge }
    | { kind: "focus"; index: number };

export type SortableClickAction = "pickUp" | "drop" | "aimAndDrop";

export type SortableZoneDefs<T, TTooltipDefs> = {
    getItems: () => SortableItemRecord<T, TTooltipDefs>[];
    updateItems: (
        update: (items: SortableItemRecord<T, TTooltipDefs>[]) => SortableItemRecord<T, TTooltipDefs>[],
    ) => void;
    getGroupId: () => string;
    getLabel: () => string;
    getRootRef: () => HTMLElement | undefined;
    getBoxRef: () => HTMLElement | undefined;
    getIsDisabled: () => boolean;
    getIsLocked: () => boolean;
    getAnnouncements: () => SortableAnnouncements;
    getOrientation: () => SortableOrientation;
    getDirection: () => NavigatorDirection;
    getLayout: () => PlacementLayout | undefined;
    getItemRects: () => DOMRect[];
    getSourceIndex: () => number | undefined;
    getPlaceCount: () => number;
    computeCanAccept?: (value: T, fromLabel: string) => boolean;
    onTransfer?: (transfer: SortableTransfer<T>) => void;
};

export type SortableTransfer<T> = {
    value: T;
    fromLabel: string;
    toLabel: string;
    fromIndex?: number;
    toIndex: number;
};

export type SortableAnnouncements = CarrierAnnouncements & {
    /**
     * Tells a keyboard user how to start moving an item. It is read out with every item as it takes focus, since
     * nothing else says the item can be moved at all.
     */
    restingKeyHint: string;
    /** Tells a keyboard user which keys move, drop and cancel a carried item, when there is no other list to go to. */
    keyHint: string;
    /** The same, for when another list would take the item too, so the key that moves between lists is mentioned. */
    keyHintAcrossZones: string;
    /**
     * Names a place in the list, which is what the pick-up, move and drop announcements say the item is at.
     *
     * @param index The place, counting from zero.
     * @param count How many places there are, which counts one extra while an item from another list is on its way
     * in.
     */
    computePlaceLabel: (index: number, count: number) => string;
};
