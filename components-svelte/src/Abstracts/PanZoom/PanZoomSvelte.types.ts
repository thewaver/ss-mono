import type { PanZoomController, PanZoomGestureTracker, PanZoomView } from "@thewaver/ss-components";
import type { Size2d } from "@thewaver/ss-utils";

import type { ValuePair } from "../../Utils/typeUtils.js";

export type PanZoomDefs = {
    getSource: () => ValuePair<PanZoomView> | undefined;
    getWindowRef: () => HTMLElement | undefined;
    getSize: () => Size2d;
    getRange: () => PanZoomView;
    getMinWidth: () => number;
    getDurationMs: () => number;
    getIsPannable: () => boolean;
    getIsZoomable: () => boolean;
    getCanCenterEdges?: (requested: PanZoomView) => boolean;
    onGestureMove?: () => void;
    onSettle?: () => void;
};

export type PanZoom = {
    getIsActive: () => boolean;
    getView: () => PanZoomView;
    getShownView: () => PanZoomView;
    getRequestedView: () => PanZoomView;
    getAspect: () => number;
    setView: (view: PanZoomView, isImmediate: boolean) => boolean;
    controller: PanZoomController;
    gestures: PanZoomGestureTracker;
};
