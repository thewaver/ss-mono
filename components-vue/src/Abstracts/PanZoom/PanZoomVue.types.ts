import type { ComputedRef, MaybeRefOrGetter, Ref } from "vue";

import type { PanZoomController, PanZoomGestureTracker, PanZoomView } from "@thewaver/ss-components";
import type { Size2d } from "@thewaver/ss-utils";

export type PanZoomVueDefs = {
    view: Ref<PanZoomView | undefined>;
    windowRef: MaybeRefOrGetter<HTMLElement | undefined>;
    size: MaybeRefOrGetter<Size2d>;
    range: MaybeRefOrGetter<PanZoomView>;
    minWidth: MaybeRefOrGetter<number>;
    durationMs: MaybeRefOrGetter<number>;
    isPannable: MaybeRefOrGetter<boolean>;
    isZoomable: MaybeRefOrGetter<boolean>;
    getCanCenterEdges?: (requested: PanZoomView) => boolean;
    onGestureMove?: () => void;
    onSettle?: () => void;
};

export type PanZoomVue = {
    isActive: ComputedRef<boolean>;
    view: ComputedRef<PanZoomView>;
    requestedView: ComputedRef<PanZoomView>;
    shownView: ComputedRef<PanZoomView>;
    aspect: ComputedRef<number>;
    setView: (view: PanZoomView, isImmediate: boolean) => boolean;
    controller: PanZoomController;
    gestures: PanZoomGestureTracker;
};
