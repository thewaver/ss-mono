import type { Accessor } from "solid-js";

import type { PanZoomController, PanZoomGestureTracker, PanZoomView } from "@thewaver/ss-components";
import type { Size2d } from "@thewaver/ss-utils";

import type { SignalSource } from "../../Utils/typeUtils";

export type PanZoomSolidDefs = {
    getSource: () => SignalSource<PanZoomView> | undefined;
    getWindowRef: Accessor<HTMLElement | undefined>;
    getSize: Accessor<Size2d>;
    getRange: Accessor<PanZoomView>;
    getMinWidth: Accessor<number>;
    getDurationMs: Accessor<number>;
    getIsPannable: Accessor<boolean>;
    getIsZoomable: Accessor<boolean>;
    getCanCenterEdges?: (requested: PanZoomView) => boolean;
    onGestureMove?: () => void;
    onSettle?: () => void;
};

export type PanZoomSolid = {
    getIsActive: Accessor<boolean>;
    getView: Accessor<PanZoomView>;
    getRequestedView: Accessor<PanZoomView>;
    getShownView: Accessor<PanZoomView>;
    getAspect: Accessor<number>;
    setView: (view: PanZoomView, isImmediate: boolean) => boolean;
    controller: PanZoomController;
    gestures: PanZoomGestureTracker;
};
