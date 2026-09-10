import { type Accessor, createEffect, createSignal, onCleanup } from "solid-js";

import { MathUtils, Point2d, Point2dUtils, RectUtils } from "@thewaver/ss-utils";

import { useViewportContext } from "../Viewport/Viewport.context";
import { ViewportUtils } from "../Viewport/Viewport.utils";
import type { PointerReading } from "./PointerTracker.types";

/** What is reported before the pointer has been seen: centred, and infinitely far away, so a distance test reads as "not near". */
const RESTING_READING: PointerReading = {
    offset: { x: 0, y: 0 },
    angle: 0,
    distance: Infinity,
    edgeOffset: { x: 0, y: 0 },
    edgeDistance: 0,
    edgeRatio: Infinity,
    boxRatio: { x: 0.5, y: 0.5 },
};

const [getIsPointerPresent, setIsPointerPresent] = createSignal(false);

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

    setIsPointerPresent(true);
    invalidate();
};

/** The pointer leaving the window, rather than moving between elements, is what counts as it going away. */
const handlePointerOut = (e: PointerEvent) => {
    if (e.relatedTarget) return;

    setIsPointerPresent(false);
};

/** Losing the window means the pointer's position can no longer be trusted. */
const handleWindowBlur = () => {
    setIsPointerPresent(false);
};

/** A scroll or a resize moves elements under a stationary pointer, so the readings need redoing. */
const handleLayoutChange = () => {
    if (clientPoint) invalidate();
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
 */
export namespace PointerTrackerUtils {
    /**
     * Tracks one element.
     *
     * @param getRef The element to track. Nothing is measured until it exists.
     * @param getIsDisabled Pass `true` to stop tracking; the element stops contributing to the shared
     * listeners entirely.
     * @returns `getReading` and `getIsPointerPresent`. The reading gives `offset` and `distance` from
     * the element's centre in pixels, `angle` as a bearing, `edgeOffset` and `edgeDistance` describing
     * how far the element's border reaches in that same direction, `edgeRatio` — below `1` inside the
     * element, `1` on its border, `2` a further element-radius away — and `boxRatio`, the pointer's
     * position across the element from `0` to `1`, which reads outside that range when the pointer is
     * outside. Readings are taken in the enclosing viewport's coordinates, so they are correct inside a
     * zoomed `Viewport`. `getIsPointerPresent` is shared by every tracker and is `false` before the
     * pointer is first seen, after it leaves the window, and when the window loses focus — which is
     * what an effect should fall back to a resting state on.
     */
    export const create = (getRef: Accessor<HTMLElement | undefined>, getIsDisabled?: Accessor<boolean>) => {
        const viewportContext = useViewportContext();
        const [getReading, setReading] = createSignal(RESTING_READING, { equals: getIsSameReading });

        const update = () => {
            const ref = getRef();

            if (!ref || !clientPoint) return;

            setReading(
                computeReading(
                    ViewportUtils.getAdjustedBoundingClientRect(ref, viewportContext),
                    ViewportUtils.getAdjustedClientPoint(clientPoint, viewportContext),
                ),
            );
        };

        createEffect(() => {
            const ref = getRef();

            if (!ref || getIsDisabled?.()) return;

            subscribers.add(update);

            if (subscribers.size === 1) attach();

            invalidate();

            onCleanup(() => {
                subscribers.delete(update);

                if (subscribers.size === 0) detach();
            });
        });

        return { getReading, getIsPointerPresent };
    };
}
