import type { Point2d, Size2d, Store } from "@thewaver/ss-utils";

export type WraparoundTile = {
    column: number;
    row: number;
};

export type WraparoundPlaneState = {
    offset: Point2d;
    original: WraparoundTile;
    isDragging: boolean;
};

export type WraparoundPlaneOpts = {
    getTileSize: () => Size2d;
    getViewportSize: () => Size2d;
    getOriginal: () => HTMLElement | undefined;
    getIsDisabled: () => boolean;
    getIsMovable: () => boolean;
    getMomentumMs: () => number;
    getGlideDurationMs: () => number;
    getKeyStepPx: () => number;
};

export type WraparoundPlane = Store<WraparoundPlaneState> & {
    observe: (root: HTMLElement) => () => void;
    moveBy: (delta: Point2d, isGliding?: boolean) => void;
    reveal: (element: HTMLElement, isGliding?: boolean) => void;
    reset: () => void;
    setDrift: (velocity: Point2d | undefined) => void;
    destroy: () => void;
};
