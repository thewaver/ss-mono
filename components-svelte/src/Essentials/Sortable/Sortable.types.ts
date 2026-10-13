import type { Snippet } from "svelte";
import type { Attachment } from "svelte/attachments";

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
} from "../../Primitives/InteractionWrapper/InteractionWrapper.types.js";

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
    /** Draws the item body. */
    renderContent: Snippet<[flags: InteractionFlags<SortableItemFlags>]>;
    /** Hands the item element to the wrapper around it, which is what the list measures and focuses. */
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

export type SortableProps<T> = Omit<InteractionWrapperProps<SortableFlags>, "renderControl" | "extraFlags"> &
    BaseSortableProps<T> & {
        /** Draws the line showing where a carried item would land. */
        renderMarker?: Snippet<[orientation: SortableOrientation]>;
        /**
         * The items, in their current order. Bind it with `bind:items`: it is the only thing that reorders them, and the
         * list writes it when an item is moved.
         */
        items: SortableItem<T>[];
        /** Draws one item. */
        renderItem: Snippet<[item: SortableItem<T>, flags: InteractionFlags<SortableItemFlags>]>;
        /** Draws the item being carried, which follows the pointer rather than sitting in the list. */
        renderCarried?: Snippet<[item: SortableItem<T>]>;
    };
