import type { RefObject } from "react";

import type { PanZoomController, PanZoomGestureTracker, PanZoomView } from "@thewaver/ss-components";
import type { Size2d } from "@thewaver/ss-utils";

export type PanZoomReactDefs = {
    source: readonly [PanZoomView, (view: PanZoomView) => void] | undefined;
    windowRef: RefObject<HTMLElement | null>;
    size: Size2d;
    range: PanZoomView;
    minWidth: number;
    durationMs: number;
    isPannable: boolean;
    isZoomable: boolean;
    computeCanCenterEdges?: (requested: PanZoomView) => boolean;
    onGestureMove?: () => void;
    onSettle?: () => void;
};

export type PanZoomReact = {
    isActive: boolean;
    view: PanZoomView;
    shownView: PanZoomView;
    getView: () => PanZoomView;
    getRequestedView: () => PanZoomView;
    getAspect: () => number;
    setView: (view: PanZoomView, isImmediate: boolean) => boolean;
    controller: PanZoomController;
    gestures: PanZoomGestureTracker;
};
