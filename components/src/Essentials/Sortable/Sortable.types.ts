import type { Point2d, Size2d } from "@thewaver/ss-utils";

import type { CarrierAnnouncements, CarryNudge, CarryOrientation } from "../../Abstracts/Carrier/Carrier.types";
import type { NavigatorDirection } from "../../Abstracts/Navigator/Navigator.types";
import type { PlacementLayout, PlacementLayoutFn } from "../../Abstracts/Placement/Placement.types";
import type { ProximityEffectFn } from "../../Abstracts/Proximity/Proximity.types";

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
    | { kind: "pick_up" }
    | { kind: "aim_at_next_zone"; step: number }
    | { kind: "nudge"; nudge: CarryNudge }
    | { kind: "focus"; index: number };

export type SortableClickAction = "pick_up" | "drop" | "aim_and_drop";

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

export type BaseSortableValues = {
    /**
     * Identifies the list, so two lists can tell their own items from each other's when something is dragged between
     * them.
     */
    groupId: string;
    /** Names the list for assistive technology. */
    ariaLabel: string;
    /**
     * Everything the list says aloud while an item is moved, and the key hints and place names those announcements
     * are built from. There is no default: every word a reader hears comes from here.
     */
    announcements: SortableAnnouncements;
    /**
     * What an item is called when it is announced, so a reader hears it named as something that moves rather than as
     * a plain list item. Defaults to "sortable item".
     */
    itemRoleDescription?: string;
    /** Whether the items run across the page or down it. */
    orientation?: SortableOrientation;
    /** The space between items. */
    gap?: number;
    /** Freezes the list as it stands: items still show, but none can be moved. */
    isLocked?: boolean;
};

export type BaseSortableCbs<T> = {
    /** Arranges the items, for a list that is something other than a straight run. */
    computeLayout?: PlacementLayoutFn;
    /** What the items do as the pointer nears them. */
    computeEffect?: ProximityEffectFn;
    /** The key one item is told apart by, which is what lets an item keep its identity as it moves. */
    computeItemKey: (value: T) => string;
    /** Names one item for assistive technology. */
    computeItemLabel: (value: T) => string;
    /**
     * Whether this list will take an item offered to it, and from which list, so a list can refuse what does not
     * belong.
     */
    computeCanAccept?: (value: T, fromLabel: string) => boolean;
    /** Runs when an item is moved, here or to another list. */
    onTransfer?: (transfer: SortableTransfer<T>) => void;
};

export type BaseSortableProps<T> = BaseSortableValues & BaseSortableCbs<T>;
