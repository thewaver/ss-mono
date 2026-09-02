import type { Accessor, JSX } from "solid-js";

import type { Point2d } from "@thewaver/ss-utils";

import type { InteractionFlags } from "../../Abstracts/InteractionTracker/InteractionTracker.types";
import type {
    InteractionTooltipDefs,
    InteractionWrapperProps,
} from "../../Fundamentals/InteractionWrapper/InteractionWrapper.types";
import type { AccessorProps, SignalSource } from "../../Utils/typeUtils";

export type SortableGridSpot = {
    x: number;
    y: number;
};

export type SortableGridSize = {
    width: number;
    height: number;
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
    turnCw: () => void;
    turnCcw: () => void;
};

export type SortableGridItemSlotProps = AccessorProps<{
    id: string;
    label: string;
    position: number;
    setSize: number;
    cells: SortableGridRect[];
    flags: InteractionFlags<SortableGridItemFlags>;
    renderContent: (getFlags: () => InteractionFlags<SortableGridItemFlags>) => JSX.Element;
    ref?: (element: HTMLElement) => void;
    onPointerDown: (e: PointerEvent) => void;
    onKeyDown: (e: KeyboardEvent) => void;
    onClick: (e: MouseEvent) => void;
    onFocus: () => void;
}>;

export type SortableGridProps<T> = Omit<InteractionWrapperProps<SortableGridFlags>, "renderControl" | "extraFlags"> &
    AccessorProps<{
        groupId: string;
        ariaLabel: string;
        columns: number;
        rows: number;
        cellSize: number;
        gap?: number;
        isLocked?: boolean;
        isTurnable?: boolean;
    }> & {
        itemsSignal: SignalSource<SortableGridItem<T>[]>;
        computeItemKey: (value: T) => string;
        computeItemLabel: (value: T) => string;
        computeCanAccept?: (value: T, fromLabel: string) => boolean;
        renderItem: (
            getItem: Accessor<SortableGridItem<T>>,
            getFlags: () => InteractionFlags<SortableGridItemFlags>,
            getGeometry: Accessor<SortableGridGeometry>,
        ) => JSX.Element;
        renderCarried?: (
            getItem: Accessor<SortableGridItem<T>>,
            getGeometry: Accessor<SortableGridGeometry>,
        ) => JSX.Element;
        renderCell?: (getSpot: Accessor<SortableGridSpot>) => JSX.Element;
        renderLanding?: (getIsAllowed: () => boolean, getGeometry: Accessor<SortableGridGeometry>) => JSX.Element;
        onTransfer?: (transfer: SortableGridTransfer<T>) => void;
        onMount?: (controller: SortableGridController) => void;
    };
