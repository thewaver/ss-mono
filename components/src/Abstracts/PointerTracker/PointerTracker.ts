import { type Accessor, createEffect, createSignal, onCleanup } from "solid-js";

import { MathUtils, Point2d, Point2dUtils, RectUtils } from "@thewaver/ss-utils";

import { useViewportContext } from "../../Exotics/Viewport/Viewport.context";
import { ViewportUtils } from "../../Exotics/Viewport/Viewport.utils";
import type { PointerReading } from "./PointerTracker.types";

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

const subscribers = new Set<() => void>();

let clientPoint: Point2d | undefined;
let frameId: ReturnType<typeof requestAnimationFrame> | undefined;

const flush = () => {
    frameId = undefined;

    for (const update of subscribers) update();
};

const invalidate = () => {
    if (frameId !== undefined) return;

    frameId = requestAnimationFrame(flush);
};

const handlePointerMove = (e: PointerEvent) => {
    clientPoint = { x: e.clientX, y: e.clientY };

    setIsPointerPresent(true);
    invalidate();
};

const handlePointerOut = (e: PointerEvent) => {
    if (e.relatedTarget) return;

    setIsPointerPresent(false);
};

const handleWindowBlur = () => {
    setIsPointerPresent(false);
};

const handleLayoutChange = () => {
    if (clientPoint) invalidate();
};

const attach = () => {
    document.addEventListener("pointermove", handlePointerMove, { passive: true });
    document.addEventListener("pointerout", handlePointerOut, { passive: true });
    document.addEventListener("scroll", handleLayoutChange, { capture: true, passive: true });
    window.addEventListener("blur", handleWindowBlur);
    window.addEventListener("resize", handleLayoutChange);
};

const detach = () => {
    document.removeEventListener("pointermove", handlePointerMove);
    document.removeEventListener("pointerout", handlePointerOut);
    document.removeEventListener("scroll", handleLayoutChange, { capture: true });
    window.removeEventListener("blur", handleWindowBlur);
    window.removeEventListener("resize", handleLayoutChange);

    if (frameId !== undefined) cancelAnimationFrame(frameId);

    frameId = undefined;
};

const getIsSameReading = (a: PointerReading, b: PointerReading) =>
    Point2d.isSame(a.offset, b.offset) && Point2d.isSame(a.edgeOffset, b.edgeOffset);

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

export namespace PointerTracker {
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
