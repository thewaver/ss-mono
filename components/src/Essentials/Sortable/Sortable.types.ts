import type { Accessor, JSX } from "solid-js";

import type { CarrierAnnouncements, CarryOrientation } from "../../Abstracts/Carrier/Carrier.types";
import type { InteractionFlags } from "../../Abstracts/InteractionTracker/InteractionTracker.types";
import type { PlacementLayoutFn } from "../../Abstracts/Placement/Placement.types";
import type { ProximityEffectFn } from "../../Abstracts/Proximity/Proximity.types";
import type {
    InteractionTooltipDefs,
    InteractionWrapperProps,
} from "../../Primitives/InteractionWrapper/InteractionWrapper.types";
import type { AccessorProps, SignalSource } from "../../Utils/typeUtils";

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

export type SortableItem<T> = {
    value: T;
    isDisabled?: boolean;
    isReachableWhenDisabled?: boolean;
    tooltipDefs?: InteractionTooltipDefs<SortableItemFlags>;
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

export type SortableItemSlotProps = AccessorProps<{
    /** Identifies this item, so the list can point focus at it. */
    id: string;
    /** Names this item for assistive technology. */
    label: string;
    /** What this item is called when it is announced, in place of list item. */
    roleDescription: string;
    /**
     * Points at the hidden text saying what the keyboard does with a resting item.
     *
     * The item announces as a list item, which says nothing about being movable, and the live region only
     * starts describing the keys once something has been picked up — so without this nobody is told that
     * Enter does anything until after they have pressed it.
     */
    hintId: string;
    /** This item's place in the list, counting from one. */
    position: number;
    /** How many items there are, so a reader can be told it is the third of five. */
    setSize: number;
    /** This item's interaction state, handed down so the painted part can answer to it. */
    flags: InteractionFlags<SortableItemFlags>;
    /** Draws the item body. */
    renderContent: (getFlags: () => InteractionFlags<SortableItemFlags>) => JSX.Element;
    /** Receives the item element once it exists, so the list can measure and scroll it. */
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

export type SortableProps<T> = Omit<InteractionWrapperProps<SortableFlags>, "renderControl" | "extraFlags"> &
    AccessorProps<{
        /**
         * Identifies the list, so two lists can tell their own items from each other's when something is dragged
         * between them.
         */
        groupId: string;
        /** Names the list for assistive technology. */
        ariaLabel: string;
        /**
         * Everything the list says aloud while an item is moved, and the key hints and place names those
         * announcements are built from. There is no default: every word a reader hears comes from here.
         */
        announcements: SortableAnnouncements;
        /**
         * What an item is called when it is announced, so a reader hears it named as something that moves rather
         * than as a plain list item. Defaults to "sortable item".
         */
        itemRoleDescription?: string;
        /** Whether the items run across the page or down it. */
        orientation?: SortableOrientation;
        /** The space between items. */
        gap?: number;
        /** Freezes the list as it stands: items still show, but none can be moved. */
        isLocked?: boolean;
        /** Draws the line showing where a carried item would land. */
        renderMarker?: (getOrientation: () => SortableOrientation) => JSX.Element;
    }> & {
        /** The items, in their current order. It is the only thing that reorders them. */
        itemsSignal: SignalSource<SortableItem<T>[]>;
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
        /** Draws one item. */
        renderItem: (
            getItem: Accessor<SortableItem<T>>,
            getFlags: () => InteractionFlags<SortableItemFlags>,
        ) => JSX.Element;
        /** Draws the item being carried, which follows the pointer rather than sitting in the list. */
        renderCarried?: (getItem: Accessor<SortableItem<T>>) => JSX.Element;
        /** Runs when an item is moved, here or to another list. */
        onTransfer?: (transfer: SortableTransfer<T>) => void;
    };
