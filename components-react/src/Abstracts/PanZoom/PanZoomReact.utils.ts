import { useEffect, useLayoutEffect, useRef, useState } from "react";

import {
    type PanZoomBounds,
    type PanZoomController,
    PanZoomUtils,
    type PanZoomView,
    TreemapUtils,
} from "@thewaver/ss-components";
import type { Point2d, Size2d } from "@thewaver/ss-utils";

import { useLatest } from "../../Utils/refUtils";
import { useStore } from "../../Utils/storeUtils";
import { SignalMirrorReactUtils } from "../SignalMirror/SignalMirrorReact.utils";
import type { PanZoomReact, PanZoomReactDefs } from "./PanZoomReact.types";

/** Zero, as a length. */
const NOTHING = 0;
/** What a glide's first frame counts from. */
const FIRST = 1;
/** The middle of the window, where a zoom with no focus is centered. */
const MIDDLE: Point2d = { x: 0.5, y: 0.5 };
/** A view that moves both ways. */
const BOTH_AXES = { x: true, y: true };

type PanZoomGlide = {
    view: PanZoomView;
    size: Size2d;
    from: PanZoomView | undefined;
    generation: number;
};

/** The React side of {@link PanZoomUtils}: a window over content, panned and zoomed by gesture, by the consumer, or both. */
export namespace PanZoomReactUtils {
    /**
     * Keeps a view over content, the window drawn from it, and the gestures that move it.
     *
     * The view the consumer writes is fitted to the window and held inside the content before it is used, so any
     * area can be asked for. A change the consumer or the controller makes glides there over `durationMs`, eased in
     * and out; a change a gesture makes, or one forced by the window being resized, lands at once, since a drag that
     * lagged behind the pointer would feel broken. A glide that starts mid-glide starts from what is on screen. The
     * glide in flight is called off on unmount.
     *
     * @param defs The consumer's view as a `[value, setValue]` pair or `undefined` for no window, the window's ref and
     * size, the content's range, the zoom limit, the glide's length, the gesture switches, how to tell whether the
     * edges may be centered for a requested view, and what to run when a gesture moves the view and when one is over.
     * @returns Whether the window is on, the view heading there and the one drawn, readers for it and for the one asked
     * for before it was fitted that include a write made a moment ago and not yet rendered, a way to set the view that says whether to glide, a controller, and the
     * gestures.
     */
    export const usePanZoom = (defs: PanZoomReactDefs): PanZoomReact => {
        const [requested, writeRequested] = SignalMirrorReactUtils.useOptionalState(defs.source, defs.range);
        const [clock] = useState(TreemapUtils.createZoomClock);
        const progress = useStore(clock);

        const isActive = defs.source !== undefined;

        const computeBounds = (view: PanZoomView): PanZoomBounds => ({
            range: defs.range,
            aspect: defs.size.width > NOTHING ? defs.size.height / defs.size.width : NOTHING,
            minWidth: defs.minWidth,
            canCenterEdges: defs.computeCanCenterEdges?.(view) ?? false,
        });

        const view = PanZoomUtils.clampView(requested, computeBounds(requested));

        const latest = useLatest({ defs, computeBounds, writeRequested });
        const liveRequested = useRef(requested);
        const liveView = useRef(view);
        const jumpTo = useRef<PanZoomView>(undefined);
        const lastShown = useRef<PanZoomView>(undefined);

        const [glide, setGlide] = useState<PanZoomGlide>(() => ({
            view,
            size: defs.size,
            from: undefined,
            generation: NOTHING,
        }));

        if (
            !PanZoomUtils.getIsSameView(glide.view, view) ||
            glide.size.width !== defs.size.width ||
            glide.size.height !== defs.size.height
        ) {
            const isJump = jumpTo.current !== undefined && PanZoomUtils.getIsSameView(jumpTo.current, view);
            const isResize = glide.size.width !== defs.size.width || glide.size.height !== defs.size.height;

            setGlide({
                view,
                size: defs.size,
                from: isJump || isResize ? undefined : lastShown.current,
                generation: glide.generation + FIRST,
            });
        }

        const shownView =
            glide.from === undefined ? view : PanZoomUtils.lerpView(glide.from, view, TreemapUtils.easeZoom(progress));

        useLayoutEffect(() => {
            lastShown.current = shownView;
        });

        useLayoutEffect(() => {
            liveRequested.current = requested;
            liveView.current = view;
        });

        useLayoutEffect(() => {
            if (glide.generation === NOTHING) return;

            jumpTo.current = undefined;

            if (glide.from === undefined) clock.stop();
            else clock.start(latest.current.defs.durationMs);
        }, [glide.generation]);

        useEffect(() => clock.stop, [clock]);

        const [api] = useState(() => {
            const setView = (next: PanZoomView, isImmediate: boolean) => {
                const clamped = PanZoomUtils.clampView(next, latest.current.computeBounds(liveRequested.current));

                if (PanZoomUtils.getIsSameView(clamped, liveView.current)) return false;

                if (isImmediate) jumpTo.current = clamped;

                liveRequested.current = clamped;
                liveView.current = clamped;
                latest.current.writeRequested(clamped);

                return true;
            };

            const getBounds = () => latest.current.computeBounds(liveRequested.current);

            const zoomBy = (factor: number, focusRatio: Point2d, isImmediate: boolean) =>
                setView(PanZoomUtils.zoomView(liveView.current, factor, focusRatio, getBounds()), isImmediate);

            const panBy = (ratio: Point2d, isImmediate: boolean) =>
                setView(PanZoomUtils.panView(liveView.current, ratio, getBounds()), isImmediate);

            const controller: PanZoomController = {
                getView: () => liveView.current,
                zoomBy: (factor, focusRatio) => zoomBy(factor, focusRatio ?? MIDDLE, false),
                panBy: (ratio) => panBy(ratio, false),
                showArea: (area) => setView(PanZoomUtils.revealView(area, liveView.current, getBounds()), false),
            };

            const gestures = PanZoomUtils.createGestureTracker({
                getAxes: () => BOTH_AXES,
                getIsPannable: () => latest.current.defs.source !== undefined && latest.current.defs.isPannable,
                getIsZoomable: () => latest.current.defs.source !== undefined && latest.current.defs.isZoomable,
                getSize: () => latest.current.defs.size,
                computePointerRatio: (client) =>
                    PanZoomUtils.computePointerRatio(
                        client,
                        latest.current.defs.windowRef.current?.getBoundingClientRect(),
                    ),
                zoomBy: (factor, focusRatio) => {
                    if (zoomBy(factor, focusRatio, true)) latest.current.defs.onGestureMove?.();
                },
                panBy: (ratio) => {
                    if (panBy(ratio, true)) latest.current.defs.onGestureMove?.();
                },
                onSettle: () => latest.current.defs.onSettle?.(),
            });

            return {
                setView,
                controller,
                gestures,
                getView: () => liveView.current,
                getRequestedView: () => liveRequested.current,
                getAspect: () => getBounds().aspect,
            };
        });

        return {
            isActive,
            view,
            shownView,
            ...api,
        };
    };
}
