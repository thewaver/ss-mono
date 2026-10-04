import { MathUtils, Point2d, Point2dUtils, RectUtils, type Store, StoreUtils } from "@thewaver/ss-utils";

import type { ViewportContextType } from "../Viewport/Viewport.context.types";
import { ViewportUtils } from "../Viewport/Viewport.utils";
import type { PointSource, PointerReading } from "./PointerTracker.types";

/** What is reported before the pointer has been seen: centered, and infinitely far away, so a distance test reads as "not near". */
const RESTING_READING: PointerReading = {
    offset: { x: 0, y: 0 },
    angle: 0,
    distance: Infinity,
    edgeOffset: { x: 0, y: 0 },
    edgeDistance: 0,
    edgeRatio: Infinity,
    boxRatio: { x: 0.5, y: 0.5 },
};

/** Whether the pointer is over the window, shared by every tracker. */
const pointerPresence = StoreUtils.create(false);

/** One update function per tracked element. */
const subscribers = new Set<() => void>();

let clientPoint: Point2d | undefined;
let frameId: ReturnType<typeof requestAnimationFrame> | undefined;

/** Recomputes every tracked element's reading. Runs once per frame at most. */
const flush = () => {
    frameId = undefined;

    for (const update of subscribers) update();
};

/** Asks for a recompute on the next frame, coalescing several requests into one. */
const invalidate = () => {
    if (frameId !== undefined) return;

    frameId = requestAnimationFrame(flush);
};

/** Remembers where the pointer is and schedules a recompute. */
const handlePointerMove = (e: PointerEvent) => {
    clientPoint = { x: e.clientX, y: e.clientY };

    pointerPresence.set(true);
    invalidate();
};

/** The pointer leaving the window, rather than moving between elements, is what counts as it going away. */
const handlePointerOut = (e: PointerEvent) => {
    if (e.relatedTarget) return;

    pointerPresence.set(false);
};

/** Losing the window means the pointer's position can no longer be trusted. */
const handleWindowBlur = () => {
    pointerPresence.set(false);
};

/** A scroll or a resize moves elements under a stationary point, so the readings need redoing. */
const handleLayoutChange = () => {
    invalidate();
};

/** Starts listening. Called when the first element is tracked. */
const attach = () => {
    document.addEventListener("pointermove", handlePointerMove, { passive: true });
    document.addEventListener("pointerout", handlePointerOut, { passive: true });
    document.addEventListener("scroll", handleLayoutChange, { capture: true, passive: true });
    window.addEventListener("blur", handleWindowBlur);
    window.addEventListener("resize", handleLayoutChange);
};

/** Stops listening and drops any pending frame. Called when the last element goes. */
const detach = () => {
    document.removeEventListener("pointermove", handlePointerMove);
    document.removeEventListener("pointerout", handlePointerOut);
    document.removeEventListener("scroll", handleLayoutChange, { capture: true });
    window.removeEventListener("blur", handleWindowBlur);
    window.removeEventListener("resize", handleLayoutChange);

    if (frameId !== undefined) cancelAnimationFrame(frameId);

    frameId = undefined;
};

/** Whether two readings are close enough to be treated as unchanged. Comparing the two offsets is enough, since everything else is derived from them. */
const getIsSameReading = (a: PointerReading, b: PointerReading) =>
    Point2d.isSame(a.offset, b.offset) && Point2d.isSame(a.edgeOffset, b.edgeOffset);

/** Where a supplied point is on screen, in the viewport's coordinates, or `undefined` while it has no point. */
const computeSourcePoint = (
    source: PointSource,
    element: HTMLElement,
    viewportContext: ViewportContextType,
): Point2d | undefined => {
    if (!source.ratio) return undefined;

    const rect = ViewportUtils.getAdjustedBoundingClientRect(source.element ?? element, viewportContext);

    return { x: rect.x + rect.width * source.ratio.x, y: rect.y + rect.height * source.ratio.y };
};

/**
 * Works out one element's reading from its rectangle and the pointer's position.
 *
 * Both an absolute and a shape-relative measure come out of this. The distance is in pixels; the
 * edge ratio divides it by how far the element's own border reaches in that same direction, so `1`
 * means the pointer is on the border whatever the element's size or proportion.
 */
const computeReading = (rect: DOMRect, point: Point2d): PointerReading => {
    const center = { x: rect.x + rect.width * 0.5, y: rect.y + rect.height * 0.5 };
    const edgePoint = RectUtils.getEdgePointTowards(rect, point);
    const offset = { x: point.x - center.x, y: point.y - center.y };
    const edgeOffset = { x: edgePoint.x - center.x, y: edgePoint.y - center.y };
    const distance = Point2dUtils.getLength(offset);
    const edgeDistance = Point2dUtils.getLength(edgeOffset);

    return {
        offset,
        angle: Point2dUtils.getAngle(offset),
        distance,
        edgeOffset,
        edgeDistance,
        edgeRatio: edgeDistance === 0 ? Infinity : distance / edgeDistance,
        boxRatio: {
            x: MathUtils.normalize(point.x, rect.x, rect.x + rect.width),
            y: MathUtils.normalize(point.y, rect.y, rect.y + rect.height),
        },
    };
};

/**
 * Reports where the pointer is relative to an element, for effects that follow it.
 *
 * One set of document listeners serves every tracked element, and readings are recomputed once per
 * animation frame rather than per event, so a page full of pointer-reactive components costs one
 * pass per frame. Scroll and resize are watched too, since either moves an element out from under a
 * pointer that has not itself moved.
 *
 * The point followed need not be the pointer: a {@link PointSource} places one as a fraction across a box, and
 * every reading is then taken against that point instead, through the same listeners and the same frame.
 */
export namespace PointerTrackerUtils {
    /** What is reported before the pointer has been seen: centered, and infinitely far away, so a distance test reads as "not near". */
    export const RESTING = RESTING_READING;

    /**
     * Whether the pointer is over the window, as a store shared by every tracker.
     *
     * `false` before the pointer is first seen, after it leaves the window, and when the window loses focus —
     * which is what an effect should fall back to a resting state on. It is kept current only while at least
     * one element is being observed.
     */
    export const presence: Store<boolean> = { get: pointerPresence.get, subscribe: pointerPresence.subscribe };

    /**
     * Whether two readings are close enough to be treated as unchanged.
     *
     * Comparing the two offsets is enough, since everything else is derived from them.
     */
    export const getIsSame = getIsSameReading;

    /**
     * Whether there is a point to follow.
     *
     * @param source The point supplied in place of the pointer, if any.
     * @param isPointerPresent {@link presence}'s current value.
     * @returns With no source, whether the pointer is over the window; with one, whether it has a point.
     */
    export const getIsPresent = (source: PointSource | undefined, isPointerPresent: boolean) =>
        source ? source.ratio !== undefined : isPointerPresent;

    /**
     * Asks every tracked element for a new reading on the next frame.
     *
     * A supplied point that moves raises no event the tracker can hear, so whoever moves it calls this. Several
     * calls in one frame cost one pass, and an element whose reading did not change reports nothing.
     */
    export const refresh = invalidate;

    /**
     * Tracks one element until the returned function is called.
     *
     * Readings are reported once per animation frame at most, and only when they change. The first arrives on
     * the next frame once the pointer has been seen.
     *
     * @param element The element to track.
     * @param viewportContext The viewport it is drawn in, whose coordinates the reading is taken in, so it is
     * correct inside a zoomed `Viewport`.
     * @param onReading Called with each new reading: `offset` and `distance` from the element's center in pixels,
     * `angle` as a bearing, `edgeOffset` and `edgeDistance` describing how far the element's border reaches in
     * that same direction, `edgeRatio` — below `1` inside the element, `1` on its border, `2` a further
     * element-radius away — and `boxRatio`, the pointer's position across the element from `0` to `1`, which
     * reads outside that range when the pointer is outside.
     * @param getSource Asked on every pass for the point to follow in place of the pointer. Left out, or
     * answering `undefined`, the pointer is followed. While the source has no point, no reading is reported and
     * the last one stands. Call {@link refresh} when it moves.
     * @returns The function that stops tracking; the element then stops contributing to the shared listeners
     * entirely.
     */
    export const observe = (
        element: HTMLElement,
        viewportContext: ViewportContextType,
        onReading: (reading: PointerReading) => void,
        getSource?: () => PointSource | undefined,
    ) => {
        let last: PointerReading | undefined;

        const update = () => {
            const source = getSource?.();
            const point = source
                ? computeSourcePoint(source, element, viewportContext)
                : clientPoint && ViewportUtils.getAdjustedClientPoint(clientPoint, viewportContext);

            if (!point) return;

            const reading = computeReading(
                ViewportUtils.getAdjustedBoundingClientRect(element, viewportContext),
                point,
            );

            if (last && getIsSameReading(last, reading)) return;

            last = reading;
            onReading(reading);
        };

        subscribers.add(update);

        if (subscribers.size === 1) attach();

        invalidate();

        return () => {
            if (!subscribers.delete(update)) return;

            if (subscribers.size === 0) detach();
        };
    };
}
