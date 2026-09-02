import type { JSX } from "solid-js";

import type { Point2d, Size2d } from "@thewaver/ss-utils";

import type { AccessorProps } from "../../Utils/typeUtils";

export type ScratchCardBrushDefs = {
    point: Point2d;
    size: Size2d;
    cellCount: Point2d;
    radius: number;
};

export type ScratchCardCellState = {
    index: number;
    cell: Point2d;
    isScratched: boolean;
};

export type ScratchCardController = {
    reset: () => void;
    clear: () => void;
};

export type ScratchCardProps = AccessorProps<{
    cellCount: Point2d;
    brushRadius?: number;
    clearThreshold?: number;
    isDisabled?: boolean;
    ariaLabel: string;
    renderContent: () => JSX.Element;
    renderCell: (getState: () => ScratchCardCellState) => JSX.Element;
    onMount?: (controller: ScratchCardController) => void;
    onScratch?: (clearedRatio: number) => void;
    onClear?: () => void;
}>;
