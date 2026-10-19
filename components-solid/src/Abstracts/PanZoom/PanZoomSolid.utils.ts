import { createComputed, createMemo, createRenderEffect, createSignal, on, onCleanup, untrack } from "solid-js";

import {
    type PanZoomBounds,
    type PanZoomController,
    PanZoomUtils,
    type PanZoomView,
    TreemapUtils,
} from "@thewaver/ss-components";
import type { Point2d } from "@thewaver/ss-utils";

import { accessStore } from "../../Utils/storeUtils";
import { SignalMirrorSolidUtils } from "../SignalMirror/SignalMirrorSolid.utils";
import type { PanZoomSolid, PanZoomSolidDefs } from "./PanZoomSolid.types";

/** Zero, as a length. */
const NOTHING = 0;
/** The middle of the window, where a zoom with no focus is centered. */
const MIDDLE: Point2d = { x: 0.5, y: 0.5 };
/** A view that moves both ways. */
const BOTH_AXES = { x: true, y: true };

/** The Solid side of {@link PanZoomUtils}: a window over content, panned and zoomed by gesture, by the consumer, or both. */
export namespace PanZoomSolidUtils {
    /**
     * Keeps a view over content, the window drawn from it, and the gestures that move it.
     *
     * The view the consumer writes is fitted to the window and held inside the content before it is used, so any
     * area can be asked for. A change the consumer or the controller makes glides there over `getDurationMs`, eased
     * in and out; a change a gesture makes, or one forced by the window being resized, lands at once, since a drag
     * that lagged behind the pointer would feel broken. A glide that starts mid-glide starts from what is on screen.
     *
     * Must run inside a component or another reactive owner, whose disposal stops a glide in flight.
     *
     * @param defs The consumer's view, the window and its size, the content's range, the zoom limit, the glide's
     * length, the gesture switches, and what to run when a gesture moves the view and when one is over.
     * @returns Whether the window is on, the view heading there, the one asked for before it was fitted and the one
     * drawn, the window's shape, a way to set the view that says whether to glide, a controller, and the gestures.
     */
    export const create = (defs: PanZoomSolidDefs): PanZoomSolid => {
        const viewSignal = SignalMirrorSolidUtils.createOptional(defs.getSource, untrack(defs.getRange));
        const clock = TreemapUtils.createZoomClock();
        const getProgress = accessStore(clock);
        const [getGlideFrom, setGlideFrom] = createSignal<PanZoomView>();

        let jumpTo: PanZoomView | undefined;
        let lastShown: PanZoomView | undefined;

        onCleanup(clock.stop);

        const getIsActive = createMemo(() => defs.getSource() !== undefined);

        const getBounds = createMemo((): PanZoomBounds => {
            const size = defs.getSize();

            return {
                range: defs.getRange(),
                aspect: size.width > NOTHING ? size.height / size.width : NOTHING,
                minWidth: defs.getMinWidth(),
                canCenterEdges: defs.getCanCenterEdges?.(viewSignal[0]()) ?? false,
            };
        });

        const getView = createMemo(() => PanZoomUtils.clampView(viewSignal[0](), getBounds()), undefined, {
            equals: PanZoomUtils.getIsSameView,
        });

        const getShownView = createMemo(() => {
            const from = getGlideFrom();

            return from === undefined
                ? getView()
                : PanZoomUtils.lerpView(from, getView(), TreemapUtils.easeZoom(getProgress()));
        });

        createRenderEffect(() => {
            lastShown = getShownView();
        });

        createComputed(
            on(
                [getView, defs.getSize],
                ([view, size], previous) => {
                    const isJump = jumpTo !== undefined && PanZoomUtils.getIsSameView(jumpTo, view);
                    const isResize =
                        previous !== undefined &&
                        (previous[1].width !== size.width || previous[1].height !== size.height);

                    jumpTo = undefined;

                    if (isJump || isResize || lastShown === undefined) {
                        clock.stop();
                        setGlideFrom(undefined);

                        return;
                    }

                    setGlideFrom(lastShown);
                    clock.start(untrack(defs.getDurationMs));
                },
                { defer: true },
            ),
        );

        const setView = (view: PanZoomView, isImmediate: boolean) => {
            const next = PanZoomUtils.clampView(view, untrack(getBounds));

            if (PanZoomUtils.getIsSameView(next, untrack(getView))) return false;

            if (isImmediate) jumpTo = next;

            viewSignal[1](() => next);

            return true;
        };

        const zoomBy = (factor: number, focusRatio: Point2d, isImmediate: boolean) =>
            setView(PanZoomUtils.zoomView(untrack(getView), factor, focusRatio, untrack(getBounds)), isImmediate);

        const panBy = (ratio: Point2d, isImmediate: boolean) =>
            setView(PanZoomUtils.panView(untrack(getView), ratio, untrack(getBounds)), isImmediate);

        const controller: PanZoomController = {
            getView: () => getView(),
            zoomBy: (factor, focusRatio) => zoomBy(factor, focusRatio ?? MIDDLE, false),
            panBy: (ratio) => panBy(ratio, false),
            showArea: (area) => setView(PanZoomUtils.revealView(area, untrack(getView), untrack(getBounds)), false),
        };

        const gestures = PanZoomUtils.createGestureTracker({
            getAxes: () => BOTH_AXES,
            getIsPannable: () => getIsActive() && defs.getIsPannable(),
            getIsZoomable: () => getIsActive() && defs.getIsZoomable(),
            getSize: () => defs.getSize(),
            computePointerRatio: (client) =>
                PanZoomUtils.computePointerRatio(client, defs.getWindowRef()?.getBoundingClientRect()),
            zoomBy: (factor, focusRatio) => {
                if (zoomBy(factor, focusRatio, true)) defs.onGestureMove?.();
            },
            panBy: (ratio) => {
                if (panBy(ratio, true)) defs.onGestureMove?.();
            },
            onSettle: () => defs.onSettle?.(),
        });

        return {
            getIsActive,
            getView,
            getRequestedView: () => viewSignal[0](),
            getShownView,
            getAspect: () => getBounds().aspect,
            setView,
            controller,
            gestures,
        };
    };
}
