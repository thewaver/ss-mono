import type { Accessor, JSX } from "solid-js";

import type {
    BaseSortableGridCbs,
    BaseSortableGridValues,
    InteractionFlags,
    SortableGridCellFlags,
    SortableGridFlags,
    SortableGridGeometry,
    SortableGridItemFlags,
    SortableGridItemRecord,
    SortableGridRect,
    SortableGridSpot,
} from "@thewaver/ss-components";

import type {
    InteractionTooltipDefs,
    InteractionWrapperProps,
} from "../../Primitives/InteractionWrapper/InteractionWrapperSolid.types";
import type { AccessorProps, AccessorValues, SignalSource } from "../../Utils/typeUtils";

export type SortableGridItem<T> = SortableGridItemRecord<T, InteractionTooltipDefs<SortableGridItemFlags>>;

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
    AccessorValues<BaseSortableGridValues> &
    BaseSortableGridCbs<T> & {
        /** The items and where they sit. It is the only thing that moves them. */
        items: SignalSource<SortableGridItem<T>[]>;
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
        /** Hands the consumer a controller once the grid is up, for moving items from outside. */
        onMount?: (controller: SortableGridController) => void;
    };
