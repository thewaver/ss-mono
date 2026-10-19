import { computed, onScopeDispose, shallowRef, toValue, watch } from "vue";

import {
    type PanZoomBounds,
    type PanZoomController,
    PanZoomUtils,
    type PanZoomView,
    TreemapUtils,
} from "@thewaver/ss-components";
import type { Point2d } from "@thewaver/ss-utils";

import { useStore } from "../../Utils/storeUtils";
import type { PanZoomVue, PanZoomVueDefs } from "./PanZoomVue.types";

/** Zero, as a length. */
const NOTHING = 0;
/** The middle of the window, where a zoom with no focus is centered. */
const MIDDLE: Point2d = { x: 0.5, y: 0.5 };
/** A view that moves both ways. */
const BOTH_AXES = { x: true, y: true };

/** The Vue side of {@link PanZoomUtils}: a window over content, panned and zoomed by gesture, by the consumer, or both. */
export namespace PanZoomVueUtils {
    /**
     * Keeps a view over content, the window drawn from it, and the gestures that move it.
     *
     * The view the consumer writes is fitted to the window and held inside the content before it is used, so any
     * area can be asked for. A change the consumer or the controller makes glides there over `durationMs`, eased in
     * and out; a change a gesture makes, or one forced by the window being resized, lands at once, since a drag that
     * lagged behind the pointer would feel broken. A glide that starts mid-glide starts from what is on screen.
     *
     * Must run inside a component's `setup` or another effect scope, whose disposal stops a glide in flight.
     *
     * @param defs The consumer's view, the window and its size, the content's range, the zoom limit, the glide's
     * length, the gesture switches, and what to run when a gesture moves the view and when one is over. The view is a
     * ref that reads `undefined` while the consumer gave none, which leaves the window off.
     * @returns Whether the window is on, the view heading there, the view as it was asked for before being fitted, and the one drawn, the window's shape, a way to set the
     * view that says whether to glide, a controller, and the gestures.
     */
    export const use = (defs: PanZoomVueDefs): PanZoomVue => {
        const own = shallowRef<PanZoomView>(toValue(defs.range));
        const clock = TreemapUtils.createZoomClock();
        const progress = useStore(clock);
        const glideFrom = shallowRef<PanZoomView>();

        let jumpTo: PanZoomView | undefined;
        let lastShown: PanZoomView | undefined;

        onScopeDispose(clock.stop);

        const isActive = computed(() => defs.view.value !== undefined);

        const requested = computed(() => defs.view.value ?? own.value);

        const size = computed(() => toValue(defs.size));

        const bounds = computed((): PanZoomBounds => ({
            range: toValue(defs.range),
            aspect: size.value.width > NOTHING ? size.value.height / size.value.width : NOTHING,
            minWidth: toValue(defs.minWidth),
            canCenterEdges: defs.getCanCenterEdges?.(requested.value) ?? false,
        }));

        const view = computed<PanZoomView>((previous) => {
            const next = PanZoomUtils.clampView(requested.value, bounds.value);

            return previous && PanZoomUtils.getIsSameView(previous, next) ? previous : next;
        });

        const shownView = computed(() =>
            glideFrom.value === undefined
                ? view.value
                : PanZoomUtils.lerpView(glideFrom.value, view.value, TreemapUtils.easeZoom(progress.value)),
        );

        lastShown = shownView.value;

        watch(
            shownView,
            (shown) => {
                lastShown = shown;
            },
            { flush: "post" },
        );

        watch([view, size], ([nextView, nextSize], [, previousSize]) => {
            const isJump = jumpTo !== undefined && PanZoomUtils.getIsSameView(jumpTo, nextView);
            const isResize = previousSize.width !== nextSize.width || previousSize.height !== nextSize.height;

            jumpTo = undefined;

            if (isJump || isResize || lastShown === undefined) {
                clock.stop();
                glideFrom.value = undefined;

                return;
            }

            glideFrom.value = lastShown;
            clock.start(toValue(defs.durationMs));
        });

        const setView = (next: PanZoomView, isImmediate: boolean) => {
            const clamped = PanZoomUtils.clampView(next, bounds.value);

            if (PanZoomUtils.getIsSameView(clamped, view.value)) return false;

            if (isImmediate) jumpTo = clamped;

            if (defs.view.value === undefined) own.value = clamped;
            else defs.view.value = clamped;

            return true;
        };

        const zoomBy = (factor: number, focusRatio: Point2d, isImmediate: boolean) =>
            setView(PanZoomUtils.zoomView(view.value, factor, focusRatio, bounds.value), isImmediate);

        const panBy = (ratio: Point2d, isImmediate: boolean) =>
            setView(PanZoomUtils.panView(view.value, ratio, bounds.value), isImmediate);

        const controller: PanZoomController = {
            getView: () => view.value,
            zoomBy: (factor, focusRatio) => zoomBy(factor, focusRatio ?? MIDDLE, false),
            panBy: (ratio) => panBy(ratio, false),
            showArea: (area) => setView(PanZoomUtils.revealView(area, view.value, bounds.value), false),
        };

        const gestures = PanZoomUtils.createGestureTracker({
            getAxes: () => BOTH_AXES,
            getIsPannable: () => isActive.value && toValue(defs.isPannable),
            getIsZoomable: () => isActive.value && toValue(defs.isZoomable),
            getSize: () => size.value,
            computePointerRatio: (client) =>
                PanZoomUtils.computePointerRatio(client, toValue(defs.windowRef)?.getBoundingClientRect()),
            zoomBy: (factor, focusRatio) => {
                if (zoomBy(factor, focusRatio, true)) defs.onGestureMove?.();
            },
            panBy: (ratio) => {
                if (panBy(ratio, true)) defs.onGestureMove?.();
            },
            onSettle: () => defs.onSettle?.(),
        });

        return {
            isActive,
            view,
            requestedView: requested,
            shownView,
            aspect: computed(() => bounds.value.aspect),
            setView,
            controller,
            gestures,
        };
    };
}
