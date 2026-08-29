import type { Accessor, JSX } from "solid-js";

import type { InteractionFlags } from "../../Abstracts/InteractionTracker/InteractionTracker.types";
import type { AccessorProps, SignalSource } from "../../Utils/typeUtils";
import type { InteractionTooltipDefs, InteractionWrapperProps } from "../InteractionWrapper/InteractionWrapper.types";

export type SortableDir = "row" | "column";

export type SortableCarryMode = "drag" | "tap" | "key";

export type SortableEndReason = "drop" | "cancel";

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

export type SortableCarry = {
    groupId: string;
    key: string;
    label: string;
    value: unknown;
};

export type SortableOrigin = {
    label: string;
    index: number;
};

export type SortableZone = {
    getGroupId: () => string;
    getLabel: () => string;
    getRootRef: () => HTMLElement | undefined;
    getItemRects: () => DOMRect[];
    getDir: () => SortableDir;
    getIsDisabled: () => boolean;
    getLength: () => number;
    computeCanAccept: (carry: SortableCarry) => boolean;
    takeAt: (index: number) => void;
    putAt: (index: number, carry: SortableCarry, origin: SortableOrigin) => void;
    moveAt: (fromIndex: number, toIndex: number) => void;
};

export type SortableTransfer<T> = {
    value: T;
    fromLabel: string;
    toLabel: string;
    fromIndex: number;
    toIndex: number;
};

export type SortableItemSlotProps = AccessorProps<{
    id: string;
    label: string;
    position: number;
    setSize: number;
    flags: InteractionFlags<SortableItemFlags>;
    renderContent: (getFlags: () => InteractionFlags<SortableItemFlags>) => JSX.Element;
    ref?: (element: HTMLElement) => void;
    onPointerDown: (e: PointerEvent) => void;
    onKeyDown: (e: KeyboardEvent) => void;
    onClick: (e: MouseEvent) => void;
    onFocus: () => void;
}>;

export type SortableProps<T> = Omit<InteractionWrapperProps<SortableFlags>, "renderControl" | "extraFlags"> &
    AccessorProps<{
        groupId: string;
        ariaLabel: string;
        dir?: SortableDir;
        gap?: number;
        isLocked?: boolean;
        renderMarker?: (getDir: () => SortableDir) => JSX.Element;
    }> & {
        itemsSignal: SignalSource<SortableItem<T>[]>;
        computeItemKey: (value: T) => string;
        computeItemLabel: (value: T) => string;
        computeCanAccept?: (value: T, fromLabel: string) => boolean;
        renderItem: (
            getItem: Accessor<SortableItem<T>>,
            getFlags: () => InteractionFlags<SortableItemFlags>,
        ) => JSX.Element;
        renderCarried?: (getItem: Accessor<SortableItem<T>>) => JSX.Element;
        onTransfer?: (transfer: SortableTransfer<T>) => void;
    };
