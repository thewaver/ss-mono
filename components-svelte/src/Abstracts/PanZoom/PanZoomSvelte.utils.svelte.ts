import { untrack } from "svelte";

import {
    type PanZoomBounds,
    type PanZoomController,
    PanZoomUtils,
    type PanZoomView,
    TreemapUtils,
} from "@thewaver/ss-components";
import type { Point2d } from "@thewaver/ss-utils";

import { readStore } from "../../Utils/storeUtils.js";
import { SignalMirrorSvelteUtils } from "../SignalMirror/SignalMirrorSvelte.utils.svelte.js";
import type { PanZoom, PanZoomDefs } from "./PanZoomSvelte.types.js";

/** Zero, as a length. */
const NOTHING = 0;
/** The middle of the window, where a zoom with no focus is centered. */
const MIDDLE: Point2d = { x: 0.5, y: 0.5 };
/** A view that moves both ways. */
const BOTH_AXES = { x: true, y: true };

/** The Svelte side of {@link PanZoomUtils}: a window over content, panned and zoomed by gesture, by the consumer, or both. */
export namespace PanZoomSvelteUtils {
    /**
     * Keeps a view over content, the window drawn from it, and the gestures that move it.
     *
     * The view the consumer writes is fitted to the window and held inside the content before it is used, so any
     * area can be asked for. A change the consumer or the controller makes glides there over `getDurationMs`, eased
     * in and out; a change a gesture makes, or one forced by the window being resized, lands at once, since a drag
     * that lagged behind the pointer would feel broken. A glide that starts mid-glide starts from what is on screen.
     *
     * Must run while a component is being set up, whose destruction stops a glide in flight.
     *
     * @param defs The consumer's view, the window and its size, the content's range, the zoom limit, the glide's
     * length, the gesture switches, and what to run when a gesture moves the view and when one is over.
     * @returns Whether the window is on, the view heading there, the one drawn and the one asked for before it was fitted, the window's shape, a way to set the
     * view that says whether to glide, a controller, and the gestures.
     */
    export const create = (defs: PanZoomDefs): PanZoom => {
        const viewPair = SignalMirrorSvelteUtils.createOptional(defs.getSource, untrack(defs.getRange));
        const clock = TreemapUtils.createZoomClock();
        const getProgress = readStore(clock);

        let glideFrom = $state.raw<PanZoomView>();
        let jumpTo: PanZoomView | undefined;
        let lastShown: PanZoomView | undefined;
        let lastView: PanZoomView | undefined;
        let lastSize: { width: number; height: number } | undefined;

        $effect(() => clock.stop);

        const getIsActive = () => defs.getSource() !== undefined;

        const bounds = $derived.by((): PanZoomBounds => {
            const size = defs.getSize();

            return {
                range: defs.getRange(),
                aspect: size.width > NOTHING ? size.height / size.width : NOTHING,
                minWidth: defs.getMinWidth(),
                canCenterEdges: defs.getCanCenterEdges?.(viewPair[0]()) ?? false,
            };
        });

        const view = $derived.by(() => {
            const next = PanZoomUtils.clampView(viewPair[0](), bounds);

            if (lastView !== undefined && PanZoomUtils.getIsSameView(lastView, next)) return lastView;

            lastView = next;

            return next;
        });

        const shownView = $derived.by(() => {
            const from = glideFrom;

            return from === undefined ? view : PanZoomUtils.lerpView(from, view, TreemapUtils.easeZoom(getProgress()));
        });

        $effect(() => {
            lastShown = shownView;
        });

        $effect.pre(() => {
            const next = view;
            const size = defs.getSize();

            untrack(() => {
                const previousSize = lastSize;

                lastSize = size;

                if (previousSize === undefined) return;

                const isJump = jumpTo !== undefined && PanZoomUtils.getIsSameView(jumpTo, next);
                const isResize = previousSize.width !== size.width || previousSize.height !== size.height;

                jumpTo = undefined;

                if (isJump || isResize || lastShown === undefined) {
                    clock.stop();
                    glideFrom = undefined;

                    return;
                }

                glideFrom = lastShown;
                clock.start(defs.getDurationMs());
            });
        });

        const setView = (next: PanZoomView, isImmediate: boolean) => {
            const clamped = PanZoomUtils.clampView(
                next,
                untrack(() => bounds),
            );

            if (
                PanZoomUtils.getIsSameView(
                    clamped,
                    untrack(() => view),
                )
            )
                return false;

            if (isImmediate) jumpTo = clamped;

            viewPair[1](clamped);

            return true;
        };

        const zoomBy = (factor: number, focusRatio: Point2d, isImmediate: boolean) =>
            setView(
                PanZoomUtils.zoomView(
                    untrack(() => view),
                    factor,
                    focusRatio,
                    untrack(() => bounds),
                ),
                isImmediate,
            );

        const panBy = (ratio: Point2d, isImmediate: boolean) =>
            setView(
                PanZoomUtils.panView(
                    untrack(() => view),
                    ratio,
                    untrack(() => bounds),
                ),
                isImmediate,
            );

        const controller: PanZoomController = {
            getView: () => view,
            zoomBy: (factor, focusRatio) => zoomBy(factor, focusRatio ?? MIDDLE, false),
            panBy: (ratio) => panBy(ratio, false),
            showArea: (area) =>
                setView(
                    PanZoomUtils.revealView(
                        area,
                        untrack(() => view),
                        untrack(() => bounds),
                    ),
                    false,
                ),
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
            getView: () => view,
            getShownView: () => shownView,
            getRequestedView: () => viewPair[0](),
            getAspect: () => bounds.aspect,
            setView,
            controller,
            gestures,
        };
    };
}
