import type { Accessor, JSX } from "solid-js";

import type { Point2d, Rect, Size2d } from "@thewaver/ss-utils";

import type { AccessorProps } from "../../../Utils/typeUtils";

export type ScratchCardBrushShape = {
    radius: number;
    computePoints?: (size: Size2d) => Point2d[];
    joinRadii?: number[];
    lameExponents?: number[];
};

export type ScratchCardBrushGeometry = {
    point: Point2d;
    radius: number;
    box: Rect;
    clipPath: string;
};

export type ScratchCardController = {
    reset: () => void;
    clear: () => void;
};

export type ScratchCardProps = AccessorProps<{
    brushRadius?: number;
    joinRadii?: number[];
    lameExponents?: number[];
    softness?: number;
    precision?: number;
    clearThreshold?: number;
    clearDurationMs?: number;
    isDisabled?: boolean;
    ariaLabel: string;
    computePoints?: (size: Size2d) => Point2d[];
    renderContent: () => JSX.Element;
    renderCover: (getMaskStyle: () => JSX.CSSProperties) => JSX.Element;
    renderBrush?: (getIsRubbing: () => boolean, getGeometry: Accessor<ScratchCardBrushGeometry>) => JSX.Element;
    onMount?: (controller: ScratchCardController) => void;
    onScratch?: (clearedRatio: number) => void;
    onClear?: () => void;
}>;
