import type { Point2d, Size2d } from "@thewaver/ss-utils";

import { SHAPE_REVEAL_DEFAULTS } from "./ShapeReveal.const";
import type { ShapeRevealChange, ShapeRevealOpts, ShapeRevealOrigin, ShapeRevealSpot } from "./ShapeReveal.types";

const OLD_PSEUDO_ELEMENT = "::view-transition-old(root)";
const NEW_PSEUDO_ELEMENT = "::view-transition-new(root)";
const BLUR_REACH = 3;
const MIN_CONTOUR_POINTS = 3;
const NO_DURATION_MS = 0;
const HALF = 0.5;

const SNAPSHOT_STYLE = { opacity: 1, mixBlendMode: "normal" };

const HOLD_KEYFRAMES: Keyframe[] = [SNAPSHOT_STYLE, SNAPSHOT_STYLE];

const SPOT_RATIOS: Record<ShapeRevealSpot, Point2d> = {
    "center": { x: HALF, y: HALF },
    "top-left": { x: 0, y: 0 },
    "top-right": { x: 1, y: 0 },
    "bottom-left": { x: 0, y: 1 },
    "bottom-right": { x: 1, y: 1 },
};

const px = (value: number) => `${value}px`;

const pointPx = (point: Point2d) => `${px(point.x)} ${px(point.y)}`;

const getIsElement = (origin: ShapeRevealOrigin): origin is Element =>
    typeof origin === "object" && "getBoundingClientRect" in origin;

const computeSegmentDistance = (point: Point2d, from: Point2d, to: Point2d) => {
    const dx = to.x - from.x;
    const dy = to.y - from.y;
    const lengthSquared = dx * dx + dy * dy;
    const along =
        lengthSquared === 0
            ? 0
            : Math.min(1, Math.max(0, ((point.x - from.x) * dx + (point.y - from.y) * dy) / lengthSquared));

    return Math.hypot(point.x - (from.x + dx * along), point.y - (from.y + dy * along));
};

const computeBounds = (outline: Point2d[] | undefined, coverRadius: number) => {
    if (!outline) return { minX: -coverRadius, minY: -coverRadius, maxX: coverRadius, maxY: coverRadius };

    const xs = outline.map((point) => point.x);
    const ys = outline.map((point) => point.y);

    return { minX: Math.min(...xs), minY: Math.min(...ys), maxX: Math.max(...xs), maxY: Math.max(...ys) };
};

/**
 * Makes a change to the page and shows the result through a shape growing from a point, over the page as it was.
 *
 * The browser's view transition does the work: it takes a picture of the page, the change is applied underneath, and
 * the new page is uncovered inside the shape until the shape covers the whole viewport. It is not tied to any one
 * kind of change — a theme, a route or a large filter all go through it the same way.
 */
export namespace ShapeRevealUtils {
    /**
     * Whether this browser can reveal a change at all.
     *
     * @returns `true` where `document.startViewTransition` exists. Where it does not, {@link reveal} still makes the
     * change, with nothing shown.
     */
    export const getIsSupported = () =>
        typeof document !== "undefined" && typeof document.startViewTransition === "function";

    /**
     * Where a named spot of the viewport is.
     *
     * @param spot The center or one of the four corners.
     * @param size The viewport's size, in pixels.
     * @returns The spot, in viewport pixels from the top-left corner.
     */
    export const resolveSpot = (spot: ShapeRevealSpot, size: Size2d): Point2d => ({
        x: SPOT_RATIOS[spot].x * size.width,
        y: SPOT_RATIOS[spot].y * size.height,
    });

    /**
     * Where a reveal grows from, as a point in viewport pixels.
     *
     * @param origin A named spot, a point in viewport pixels, which is used as it is, or an element, whose center is
     * read where it sits on screen at the moment of the call.
     * @param size The viewport's size, in pixels.
     */
    export const resolveOrigin = (origin: ShapeRevealOrigin, size: Size2d): Point2d => {
        if (typeof origin === "string") return resolveSpot(origin, size);

        if (!getIsElement(origin)) return origin;

        const rect = origin.getBoundingClientRect();

        return { x: rect.left + rect.width * HALF, y: rect.top + rect.height * HALF };
    };

    /**
     * How far the corner of the viewport farthest from a point is, which is how far a shape growing from that point
     * has to reach before nothing of the old page is left.
     *
     * @param origin The point, in viewport pixels. It may lie outside the viewport.
     * @param size The viewport's size, in pixels.
     */
    export const computeFarthestDistance = (origin: Point2d, size: Size2d) =>
        Math.hypot(Math.max(origin.x, size.width - origin.x), Math.max(origin.y, size.height - origin.y));

    /**
     * The distance from a point inside a closed contour to the nearest part of its edge.
     *
     * @param points The contour's corners, in order; the last joins back to the first.
     * @param center The point to measure from.
     * @returns The shortest distance to any of the contour's sides, or `0` for fewer than three corners.
     */
    export const computeInnerRadius = (points: Point2d[], center: Point2d) => {
        if (points.length < MIN_CONTOUR_POINTS) return 0;

        return Math.min(
            ...points.map((point, index) => computeSegmentDistance(center, point, points[(index + 1) % points.length])),
        );
    };

    /**
     * A contour grown about its own center until even the nearest part of its edge is a given distance away.
     *
     * The center is the average of the contour's corners, which is the point the shape grows from; every default
     * shape encloses its own. Growing until the nearest edge reaches the distance means a circle of that radius fits
     * inside, so a shape grown to {@link computeFarthestDistance} covers the whole viewport whatever way it is turned.
     *
     * @param computePoints The contour, worked out from a square box as wide as that circle, as `Shape` and `Reveal`
     * take it. Its size is a starting point only, since the result is scaled.
     * @param coverRadius The distance the nearest edge has to reach.
     * @returns The corners relative to the center, in pixels, or `undefined` when the contour has fewer than three
     * corners or does not enclose its center.
     */
    export const computeOutline = (computePoints: (size: Size2d) => Point2d[], coverRadius: number) => {
        const side = coverRadius * 2;
        const points = computePoints({ width: side, height: side });

        if (points.length < MIN_CONTOUR_POINTS) return undefined;

        const center = {
            x: points.reduce((sum, point) => sum + point.x, 0) / points.length,
            y: points.reduce((sum, point) => sum + point.y, 0) / points.length,
        };
        const innerRadius = computeInnerRadius(points, center);

        if (!(innerRadius > 0)) return undefined;

        const scale = coverRadius / innerRadius;

        return points.map((point) => ({ x: (point.x - center.x) * scale, y: (point.y - center.y) * scale }));
    };

    /**
     * The frames of a hard-edged reveal, as a `clip-path` growing from nothing at the origin.
     *
     * @param origin Where the shape grows from, in viewport pixels.
     * @param coverRadius How far the shape's nearest edge reaches at the end.
     * @param outline From {@link computeOutline}. Left out, a circle.
     * @returns Two keyframes for `Element.animate`: the shape at no size on the origin, and the shape covering the
     * viewport. Every corner moves in a straight line, so the shape keeps its outline the whole way.
     */
    export const computeClipKeyframes = (
        origin: Point2d,
        coverRadius: number,
        outline: Point2d[] | undefined,
    ): Keyframe[] => {
        if (!outline) {
            return [
                { clipPath: `circle(0px at ${pointPx(origin)})` },
                { clipPath: `circle(${px(coverRadius)} at ${pointPx(origin)})` },
            ];
        }

        const toPolygon = (points: Point2d[]) => `polygon(${points.map(pointPx).join(", ")})`;

        return [
            { clipPath: toPolygon(outline.map(() => origin)) },
            { clipPath: toPolygon(outline.map((point) => ({ x: origin.x + point.x, y: origin.y + point.y }))) },
        ];
    };

    /**
     * The frames of a soft-edged reveal, as a blurred image of the shape used as a mask and grown from nothing.
     *
     * The image is drawn once at its final size and scaled up from the origin, so the edge's softness grows with the
     * shape and is `blur` at the end. The image leaves room for the blur on every side, and the caller is expected to
     * have reached past the viewport by enough for the blur to fade out before the edge, as {@link computeKeyframes}
     * does.
     *
     * @param origin Where the shape grows from, in viewport pixels.
     * @param coverRadius How far the shape's nearest edge reaches at the end.
     * @param outline From {@link computeOutline}. Left out, a circle.
     * @param blur How soft the edge is at the end, as the standard deviation in pixels, which is what CSS `blur()`
     * takes.
     * @returns Two keyframes for `Element.animate`, both carrying the same `mask-image` and moving only its size and
     * position.
     */
    export const computeMaskKeyframes = (
        origin: Point2d,
        coverRadius: number,
        outline: Point2d[] | undefined,
        blur: number,
    ): Keyframe[] => {
        const pad = blur * BLUR_REACH;
        const bounds = computeBounds(outline, coverRadius);
        const offset = { x: pad - bounds.minX, y: pad - bounds.minY };
        const width = bounds.maxX - bounds.minX + pad * 2;
        const height = bounds.maxY - bounds.minY + pad * 2;
        const paint = `fill="black" style="filter:blur(${px(blur)})"`;
        const shape = outline
            ? `<polygon points="${outline.map((point) => `${point.x + offset.x},${point.y + offset.y}`).join(" ")}" ${paint}/>`
            : `<circle cx="${offset.x}" cy="${offset.y}" r="${coverRadius}" ${paint}/>`;
        const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">${shape}</svg>`;
        const image = `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;

        return [
            { maskImage: image, maskRepeat: "no-repeat", maskSize: "0px 0px", maskPosition: pointPx(origin) },
            {
                maskImage: image,
                maskRepeat: "no-repeat",
                maskSize: `${px(width)} ${px(height)}`,
                maskPosition: pointPx({ x: origin.x - offset.x, y: origin.y - offset.y }),
            },
        ];
    };

    /**
     * The frames the new page is uncovered with.
     *
     * @param origin Where the shape grows from, in viewport pixels.
     * @param size The viewport's size, in pixels.
     * @param computePoints The shape's contour, as {@link computeOutline} takes it. Left out, a circle; a contour it
     * cannot use falls back to the circle too.
     * @param blur How soft the edge is, as {@link computeMaskKeyframes} takes it. `0` gives a hard edge through a
     * `clip-path`, anything more a mask.
     * @returns Two keyframes that also hold the new page fully opaque and unblended, which is what the browser's own
     * cross-fade would otherwise change.
     */
    export const computeKeyframes = (
        origin: Point2d,
        size: Size2d,
        computePoints: ((size: Size2d) => Point2d[]) | undefined,
        blur: number,
    ): Keyframe[] => {
        const softness = Math.max(blur, 0);
        const coverRadius = computeFarthestDistance(origin, size) + softness * BLUR_REACH;
        const outline = computePoints ? computeOutline(computePoints, coverRadius) : undefined;
        const frames =
            softness > 0
                ? computeMaskKeyframes(origin, coverRadius, outline, softness)
                : computeClipKeyframes(origin, coverRadius, outline);

        return frames.map((frame) => ({ ...frame, ...SNAPSHOT_STYLE }));
    };

    /**
     * Makes a change and reveals the result through a shape growing from a point.
     *
     * The change runs once, whatever happens: where the browser has no view transitions, or `durationMs` is `0`, it
     * simply runs, so a consumer honoring reduced motion passes `0`. The browser holds the page still while the
     * change runs, so a change that waits on something should be quick. Starting a second reveal while one is under
     * way cuts the first short, as the browser does with any two view transitions.
     *
     * @param change What to do. It may return a promise, and the picture of the new page is taken once that settles,
     * so a framework that renders later than the write — React, Vue, Svelte — flushes its update inside it.
     * @param opts Where the shape grows from (`origin`: a named spot, a point in viewport pixels, or an element whose
     * center is used, read before the change runs; the center by default), how long it takes (`durationMs`) and how
     * it eases (`easing`, any CSS easing), the shape (`computePoints`, as `Shape` takes it; a circle when left out)
     * and how soft its edge is (`blur`, in pixels; a hard edge at `0`). Defaults are in `SHAPE_REVEAL_DEFAULTS`.
     * @returns A promise that settles once the reveal has finished, with `true` when the change was shown through
     * the shape and `false` when it simply happened. It rejects with the change's own error if the change throws.
     */
    export const reveal = async (change: ShapeRevealChange, opts: ShapeRevealOpts = {}) => {
        const durationMs = opts.durationMs ?? SHAPE_REVEAL_DEFAULTS.durationMs;

        if (durationMs <= NO_DURATION_MS || !getIsSupported()) {
            await change();

            return false;
        }

        const size = { width: window.innerWidth, height: window.innerHeight };
        const origin = resolveOrigin(opts.origin ?? SHAPE_REVEAL_DEFAULTS.origin, size);
        const transition = document.startViewTransition(() => change());
        const hasFinished = transition.finished.then(
            () => true,
            () => false,
        );

        try {
            await transition.ready;
        } catch {
            await transition.updateCallbackDone;

            return false;
        }

        const timing: KeyframeAnimationOptions = {
            duration: durationMs,
            easing: opts.easing ?? SHAPE_REVEAL_DEFAULTS.easing,
            fill: "forwards",
        };
        const keyframes = computeKeyframes(origin, size, opts.computePoints, opts.blur ?? SHAPE_REVEAL_DEFAULTS.blur);

        const animations = [
            document.documentElement.animate(HOLD_KEYFRAMES, { ...timing, pseudoElement: OLD_PSEUDO_ELEMENT }),
            document.documentElement.animate(keyframes, { ...timing, pseudoElement: NEW_PSEUDO_ELEMENT }),
        ];
        const result = await hasFinished;

        animations.forEach((animation) => animation.cancel());

        return result;
    };
}
