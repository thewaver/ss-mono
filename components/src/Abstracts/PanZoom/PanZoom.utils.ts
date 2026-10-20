import { MathUtils, type Point2d, Point2dUtils, type Span, SpanUtils } from "@thewaver/ss-utils";

import type {
    PanZoomAxes,
    PanZoomBounds,
    PanZoomGestureDefs,
    PanZoomGestureTracker,
    PanZoomView,
} from "./PanZoom.types";

/** Zero, as a length or a count. */
const NOTHING = 0;
/** One pointer, one step. */
const SINGLE = 1;
/** Halfway, for a middle. */
const HALF = 0.5;
/** How much one pixel of wheel travel zooms by, as an exponent. */
const ZOOM_RATE = 0.0015;
/** How many pointers make a pinch. */
const PINCH_POINTERS = 2;
/** How far a press may travel, in pixels, before it stops being a click and becomes a pan. */
const DRAG_SLOP = 4;
/** How long the wheel has to rest before a run of wheel events counts as one finished gesture. */
const WHEEL_SETTLE_MS = 200;
/** The mouse button that pans. */
const PRIMARY_BUTTON = 0;
/** The middle of a box, as a ratio across and down it. */
const MIDDLE: Point2d = { x: HALF, y: HALF };

/** A point with the directions that do not count set to zero. */
const project = (point: Point2d, axes: PanZoomAxes): Point2d => ({
    x: axes.x ? point.x : NOTHING,
    y: axes.y ? point.y : NOTHING,
});

/**
 * Panning and zooming a window over content larger than it, in one direction or two.
 *
 * Two areas matter throughout and it is worth keeping them apart: the range is all the content there is, and the view
 * is the part of it in the window. Both are written in the content's own units — pixels, seconds, fractions of a
 * board's width — so the same arithmetic serves a timeline, a bracket and a patch board. A span is one direction's
 * stretch; a view is a span across and a span down, and its zoom is always the same both ways, so its shape is the
 * window's.
 */
export namespace PanZoomUtils {
    /**
     * The whole of a size, as a view from its corner.
     *
     * @param width How far across the content runs.
     * @param height How far down.
     */
    export const toFullView = (width: number, height: number): PanZoomView => ({
        x: { start: NOTHING, end: width },
        y: { start: NOTHING, end: height },
    });

    /**
     * Whether two views cover exactly the same area.
     *
     * @param first One view.
     * @param second The other.
     */
    export const getIsSameView = (first: PanZoomView, second: PanZoomView) =>
        first.x.start === second.x.start &&
        first.x.end === second.x.end &&
        first.y.start === second.y.start &&
        first.y.end === second.y.end;

    /**
     * How wide a view may get and still be honored by the bounds.
     *
     * The widest is the one that shows the whole range, which on a range shaped differently from the window leaves
     * room to spare on one side; the narrowest is `minWidth`, capped by that widest.
     *
     * @param width The width asked for.
     * @param bounds The range, the window's shape and the narrowest view allowed.
     * @returns The width, held between the two.
     */
    export const clampWidth = (width: number, bounds: PanZoomBounds) => {
        const widest = Math.max(
            SpanUtils.getExtent(bounds.range.x),
            SpanUtils.getExtent(bounds.range.y) / bounds.aspect,
        );

        return Math.min(Math.max(width, Math.min(bounds.minWidth, widest)), widest);
    };

    /**
     * Grows a view in one direction until it has the window's shape, about its own middle.
     *
     * A consumer asks for the area that has to be seen; the window decides the shape, so the view is widened or
     * deepened to match rather than stretched.
     *
     * @param view The area asked for.
     * @param aspect The window's height divided by its width.
     * @returns The view with the window's shape, covering at least the area asked for. A view or a window of no size
     * is returned unchanged, since it has no shape to match.
     */
    export const fitView = (view: PanZoomView, aspect: number): PanZoomView => {
        const width = SpanUtils.getExtent(view.x);
        const height = SpanUtils.getExtent(view.y);

        if (width <= NOTHING || height <= NOTHING || !(aspect > NOTHING)) return view;

        const fittedWidth = Math.max(width, height / aspect);

        return {
            x: SpanUtils.fromCenter(SpanUtils.getCenter(view.x), fittedWidth),
            y: SpanUtils.fromCenter(SpanUtils.getCenter(view.y), fittedWidth * aspect),
        };
    };

    /**
     * Holds a view inside the range, with the window's shape and a sensible size.
     *
     * The shape is matched first, then the size held between the narrowest allowed and the one that shows the whole
     * range, about the view's middle, and last the position: in a direction where the view is no larger than the
     * range it is slid back inside it, and in one where it is larger the range sits in its middle. With
     * `canCenterEdges`, the position is held more loosely: the view's middle only has to stay over the range, so any
     * part of the content, an edge included, can be brought to the middle of the window, with empty space beyond it.
     *
     * @param view The view to correct.
     * @param bounds The range, the window's shape, the narrowest view allowed, and whether an edge may be centered.
     * @returns The corrected view. Without a window shape to match, the view is returned unchanged.
     */
    export const clampView = (view: PanZoomView, bounds: PanZoomBounds): PanZoomView => {
        if (!(bounds.aspect > NOTHING)) return view;

        const fitted = fitView(view, bounds.aspect);
        const width = clampWidth(SpanUtils.getExtent(fitted.x), bounds);

        const place = (span: Span, extent: number, range: Span): Span => {
            if (bounds.canCenterEdges)
                return SpanUtils.fromCenter(MathUtils.clamp(SpanUtils.getCenter(span), range.start, range.end), extent);

            if (extent >= SpanUtils.getExtent(range)) return SpanUtils.fromCenter(SpanUtils.getCenter(range), extent);

            const start = MathUtils.clamp(SpanUtils.getCenter(span) - extent * HALF, range.start, range.end - extent);

            return { start, end: start + extent };
        };

        return {
            x: place(fitted.x, width, bounds.range.x),
            y: place(fitted.y, width * bounds.aspect, bounds.range.y),
        };
    };

    /**
     * Zooms a view about a point, the same amount both ways.
     *
     * @param view The view before zooming.
     * @param factor Below `1` to zoom in, above to zoom out.
     * @param focusRatio Where the zoom is centered, as a ratio across and down the view. What sits there stays there.
     * @param bounds The range, the window's shape and the narrowest view allowed.
     */
    export const zoomView = (
        view: PanZoomView,
        factor: number,
        focusRatio: Point2d,
        bounds: PanZoomBounds,
    ): PanZoomView => {
        const width = clampWidth(SpanUtils.getExtent(view.x) * factor, bounds);
        const height = width * bounds.aspect;
        const anchor = { x: SpanUtils.toValue(focusRatio.x, view.x), y: SpanUtils.toValue(focusRatio.y, view.y) };
        const left = anchor.x - focusRatio.x * width;
        const top = anchor.y - focusRatio.y * height;

        return clampView({ x: { start: left, end: left + width }, y: { start: top, end: top + height } }, bounds);
    };

    /**
     * Slides a view along without changing how much it shows.
     *
     * @param view The view before panning.
     * @param ratio How far to move across and down, each as a fraction of the view's own extent that way.
     * @param bounds The range, the window's shape and the narrowest view allowed.
     */
    export const panView = (view: PanZoomView, ratio: Point2d, bounds: PanZoomBounds): PanZoomView => {
        const shiftX = SpanUtils.getExtent(view.x) * ratio.x;
        const shiftY = SpanUtils.getExtent(view.y) * ratio.y;

        return clampView(
            {
                x: { start: view.x.start + shiftX, end: view.x.end + shiftX },
                y: { start: view.y.start + shiftY, end: view.y.end + shiftY },
            },
            bounds,
        );
    };

    /**
     * Slides a view just far enough to bring an area into it, without zooming.
     *
     * @param area The area that has to end up in view.
     * @param view The current view.
     * @param bounds The range, the window's shape and the narrowest view allowed.
     * @returns The view unchanged when the area is already inside it. An area larger than the view in one direction
     * is aligned to its start that way.
     */
    export const revealView = (area: PanZoomView, view: PanZoomView, bounds: PanZoomBounds): PanZoomView =>
        clampView(
            {
                x: SpanUtils.reveal(area.x, view.x, { start: -Infinity, end: Infinity }),
                y: SpanUtils.reveal(area.y, view.y, { start: -Infinity, end: Infinity }),
            },
            bounds,
        );

    /**
     * How much two views have in common, against how much they cover between them.
     *
     * @param first One view.
     * @param second The other.
     * @returns `1` for the same area, `0` for areas that do not meet, and in between the area they share divided by the
     * area either covers. Two views of no area report `0`.
     */
    export const computeOverlapRatio = (first: PanZoomView, second: PanZoomView) => {
        const overlap = (a: Span, b: Span) => Math.max(Math.min(a.end, b.end) - Math.max(a.start, b.start), NOTHING);
        const shared = overlap(first.x, second.x) * overlap(first.y, second.y);
        const area = (view: PanZoomView) => SpanUtils.getExtent(view.x) * SpanUtils.getExtent(view.y);
        const union = area(first) + area(second) - shared;

        return union > NOTHING ? shared / union : NOTHING;
    };

    /**
     * A view part of the way from one to another.
     *
     * @param from Where it starts.
     * @param to Where it ends.
     * @param progress How far between, `0` to `1`.
     */
    export const lerpView = (from: PanZoomView, to: PanZoomView, progress: number): PanZoomView => ({
        x: {
            start: MathUtils.lerp(from.x.start, to.x.start, progress),
            end: MathUtils.lerp(from.x.end, to.x.end, progress),
        },
        y: {
            start: MathUtils.lerp(from.y.start, to.y.start, progress),
            end: MathUtils.lerp(from.y.end, to.y.end, progress),
        },
    });

    /**
     * How many window pixels one unit of content takes up at this view.
     *
     * @param view The view.
     * @param windowWidth How wide the window is, in pixels.
     * @returns The scale. A view of no width reports `1`.
     */
    export const computeScale = (view: PanZoomView, windowWidth: number) => {
        const width = SpanUtils.getExtent(view.x);

        return width > NOTHING ? windowWidth / width : SINGLE;
    };

    /**
     * Whether a press should be answered at all: any touch or pen, and the primary button of a mouse.
     *
     * @param e The press, or anything carrying its `button` and `pointerType`.
     */
    export const getIsPrimaryPress = (e: { button: number; pointerType: string }) =>
        e.button === PRIMARY_BUTTON || e.pointerType !== "mouse";

    /**
     * Where a pointer sits in a window, as a ratio across and down it.
     *
     * @param client The pointer's position in the browser window.
     * @param rect The window's box in the browser window. Missing, or of no size one way, reads as the middle that
     * way.
     * @returns `0` at the left and top edges and `1` at the right and bottom ones, reaching outside that for a pointer
     * outside the box.
     */
    export const computePointerRatio = (
        client: Point2d,
        rect: { left: number; top: number; width: number; height: number } | undefined,
    ): Point2d => {
        if (rect === undefined) return MIDDLE;

        return {
            x: rect.width === NOTHING ? HALF : (client.x - rect.left) / rect.width,
            y: rect.height === NOTHING ? HALF : (client.y - rect.top) / rect.height,
        };
    };

    /**
     * How much one wheel event zooms by.
     *
     * @param deltaY The event's vertical travel. Down zooms out and up zooms in.
     * @returns The factor to scale the visible extent by.
     */
    export const computeWheelFactor = (deltaY: number) => Math.exp(deltaY * ZOOM_RATE);

    /**
     * Drag to pan, pinch to zoom, and the wheel, for one window.
     *
     * A press that stays within four pixels of where it went down is left alone, so its click still reaches the
     * content under it; past that, the pointer is captured and every move pans. Capturing only then is the whole
     * trick: capture taken on the press would redirect the click as well, and nothing inside could ever be pressed.
     * Two pointers down make a pinch, which zooms by the change in their gap and pans by the change in their middle.
     * Only the directions `getAxes` names count, so a window that moves only across ignores how far a drag or a pinch
     * travels down. `onSettle` runs once a gesture that moved the view is over: a drag or a pinch when its pointers
     * are lifted, and the wheel once it has rested for a fifth of a second, since a wheel has no release of its own.
     *
     * @param defs Which directions the view moves in, whether each gesture is on, the window's size, where a pointer
     * sits in it, the zoom and pan commands, and what to run when a gesture is over, all read at the moment a gesture
     * needs them.
     * @returns Handlers for the window's pointer and wheel events. The move and release handlers take the window,
     * which is what holds the capture.
     */
    export const createGestureTracker = (defs: PanZoomGestureDefs): PanZoomGestureTracker => {
        const points = new Map<number, Point2d>();

        let isGrabbing = false;
        let hasPinched = false;
        let wheelTimer: ReturnType<typeof setTimeout> | undefined;
        let panFrom: Point2d | undefined;
        let pinchGap: number | undefined;
        let pinchCenter: Point2d | undefined;

        const pinch = () => {
            const axes = defs.getAxes();
            const [first, second] = [...points.values()];
            const gap = Point2dUtils.getDistance(project(first, axes), project(second, axes));
            const center = { x: (first.x + second.x) * HALF, y: (first.y + second.y) * HALF };

            if (pinchGap !== undefined && gap > NOTHING && pinchCenter !== undefined) {
                const size = defs.getSize();

                hasPinched = true;

                if (defs.getIsZoomable()) defs.zoomBy(pinchGap / gap, defs.computePointerRatio(center));
                const shift = project({ x: pinchCenter.x - center.x, y: pinchCenter.y - center.y }, axes);

                if (defs.getIsPannable())
                    defs.panBy({
                        x: size.width > NOTHING ? shift.x / size.width : NOTHING,
                        y: size.height > NOTHING ? shift.y / size.height : NOTHING,
                    });
            }

            pinchGap = gap;
            pinchCenter = center;
        };

        return {
            press: (e) => {
                if (!getIsPrimaryPress(e)) return;
                if (!defs.getIsPannable() && !defs.getIsZoomable()) return;

                points.set(e.pointerId, { x: e.clientX, y: e.clientY });
                panFrom = points.size === SINGLE ? { x: e.clientX, y: e.clientY } : undefined;
                pinchGap = undefined;
            },
            move: (e, element) => {
                if (!points.has(e.pointerId)) return;

                const point = { x: e.clientX, y: e.clientY };

                points.set(e.pointerId, point);

                if (points.size >= PINCH_POINTERS) {
                    pinch();

                    return;
                }

                if (panFrom === undefined || !defs.getIsPannable()) return;

                const traveled = project({ x: point.x - panFrom.x, y: point.y - panFrom.y }, defs.getAxes());

                if (!isGrabbing && Math.hypot(traveled.x, traveled.y) < DRAG_SLOP) return;

                if (!isGrabbing) {
                    isGrabbing = true;
                    element.setPointerCapture(e.pointerId);
                }

                const size = defs.getSize();

                defs.panBy({
                    x: size.width > NOTHING ? -traveled.x / size.width : NOTHING,
                    y: size.height > NOTHING ? -traveled.y / size.height : NOTHING,
                });

                panFrom = point;
            },
            release: (e, element) => {
                points.delete(e.pointerId);
                pinchGap = undefined;

                if (points.size < PINCH_POINTERS) panFrom = points.values().next().value;

                if (points.size > NOTHING) return;

                const hasMoved = isGrabbing || hasPinched;

                if (isGrabbing) element.releasePointerCapture(e.pointerId);

                isGrabbing = false;
                hasPinched = false;

                if (hasMoved) defs.onSettle?.();
            },
            wheel: (e) => {
                if (!defs.getIsZoomable()) return;

                e.preventDefault();
                defs.zoomBy(computeWheelFactor(e.deltaY), defs.computePointerRatio({ x: e.clientX, y: e.clientY }));

                if (wheelTimer !== undefined) clearTimeout(wheelTimer);

                wheelTimer = setTimeout(() => {
                    wheelTimer = undefined;
                    defs.onSettle?.();
                }, WHEEL_SETTLE_MS);
            },
        };
    };
}
