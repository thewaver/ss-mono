import type { VNodeChild } from "vue";

import type {
    BaseSortableProps,
    InteractionFlags,
    SortableFlags,
    SortableItemFlags,
    SortableItemRecord,
    SortableOrientation,
} from "@thewaver/ss-components";

import type {
    InteractionTooltipDefs,
    InteractionWrapperProps,
    InteractionWrapperSlots,
} from "../../Primitives/InteractionWrapper/InteractionWrapper.types";

export type SortableItem<T> = SortableItemRecord<T, InteractionTooltipDefs<SortableItemFlags>>;

export type SortableItemSlotProps = {
    /** Identifies this item, so the list can point focus at it. */
    id: string;
    /** Names this item for assistive technology. */
    label: string;
    /** What this item is called when it is announced, in place of list item. */
    roleDescription: string;
    /**
     * Points at the hidden text saying what the keyboard does with a resting item.
     *
     * The item announces as a list item, which says nothing about being movable, and the live region only starts
     * describing the keys once something has been picked up — so without this nobody is told that Enter does anything
     * until after they have pressed it.
     */
    hintId: string;
    /** This item's place in the list, counting from one. */
    position: number;
    /** How many items there are, so a reader can be told it is the third of five. */
    setSize: number;
    /** This item's interaction state, handed down so the painted part can answer to it. */
    flags: InteractionFlags<SortableItemFlags>;
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

export type SortableItemSlotSlots = {
    /** Draws the item body. */
    renderContent: (flags: InteractionFlags<SortableItemFlags>) => VNodeChild;
};

export type SortableProps<T> = Omit<InteractionWrapperProps<SortableFlags>, "extraFlags"> &
    BaseSortableProps<T> & {
        /** The items, in their current order. It is the only thing that reorders them. */
        "items": SortableItem<T>[];
        /** Receives the items in their new order as they are moved, which is what `v-model:items` binds. */
        "onUpdate:items"?: (items: SortableItem<T>[]) => void;
    };

export type SortableSlots<T> = Pick<InteractionWrapperSlots<SortableFlags>, "renderDecoration"> & {
    /** Draws one item. */
    renderItem: (props: { item: SortableItem<T>; flags: InteractionFlags<SortableItemFlags> }) => VNodeChild;
    /** Draws the line showing where a carried item would land. */
    renderMarker?: (orientation: SortableOrientation) => VNodeChild;
    /** Draws the item being carried, which follows the pointer rather than sitting in the list. */
    renderCarried?: (item: SortableItem<T>) => VNodeChild;
};
