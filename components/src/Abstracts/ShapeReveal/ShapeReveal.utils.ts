import { MathUtils, type Point2d, Point2dUtils, RectUtils, type Size2d } from "@thewaver/ss-utils";

import { SHAPE_REVEAL_DEFAULTS } from "./ShapeReveal.const";
import type { ShapeRevealChange, ShapeRevealOpts, ShapeRevealOrigin, ShapeRevealSpot } from "./ShapeReveal.types";

const OLD_PSEUDO_ELEMENT = "::view-transition-old(root)";
const NEW_PSEUDO_ELEMENT = "::view-transition-new(root)";
const BLUR_REACH = 3;
const MIN_CONTOUR_POINTS = 3;
const NO_DURATION_MS = 0;
const HALF = 0.5;
const CLIP_STEP_DEGREES = 15;
const MASK_FRAME_MS = 10;
const PIVOT: Point2d = { x: 0, y: 0 };

const SNAPSHOT_STYLE = { opacity: 1, mixBlendMode: "normal" };

const HOLD_KEYFRAMES: Keyframe[] = [SNAPSHOT_STYLE, SNAPSHOT_STYLE];

const SPOT_RATIOS: Record<ShapeRevealSpot, Point2d> = {
    center: { x: HALF, y: HALF },
    top_left: { x: 0, y: 0 },
    top_right: { x: 1, y: 0 },
    bottom_left: { x: 0, y: 1 },
    bottom_right: { x: 1, y: 1 },
};

const px = (value: number) => `${value}px`;

const pointPx = (point: Point2d) => `${px(point.x)} ${px(point.y)}`;

const getIsElement = (origin: ShapeRevealOrigin): origin is Element =>
    typeof origin === "object" && "getBoundingClientRect" in origin;

const rotateOutline = (outline: Point2d[], degrees: number) =>
    outline.map((point) => Point2dUtils.rotateAbout(point, PIVOT, degrees));

const toMaskImage = (width: number, height: number, body: string) => {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">${body}</svg>`;

    return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
};

const toBlurredPolygon = (points: Point2d[], offset: Point2d, blur: number) =>
    `<polygon points="${points.map((point) => `${point.x + offset.x},${point.y + offset.y}`).join(" ")}" fill="black" style="filter:blur(${px(blur)})"/>`;

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

        return RectUtils.getCenter(origin.getBoundingClientRect());
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
            ...points.map((point, index) =>
                Point2dUtils.getSegmentDistance(center, point, points[(index + 1) % points.length]),
            ),
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
     * A shape that turns as it grows gets a keyframe for every 15° of the turn rather than two, because the browser
     * moves each corner in a straight line between keyframes: across two, a turned shape would fold through its own
     * center instead of turning. Within 15° a corner's straight path stays within about one percent of its arc.
     *
     * @param origin Where the shape grows from, in viewport pixels.
     * @param coverRadius How far the shape's nearest edge reaches at the end.
     * @param outline From {@link computeOutline}. Left out, a circle, which turning does not change.
     * @param startDegrees The shape's angle as it starts to grow, clockwise.
     * @param endDegrees Its angle once it covers the viewport; equal to `startDegrees`, the shape is only tilted.
     * @returns Keyframes for `Element.animate`, evenly spaced, from the shape at no size on the origin to the shape
     * covering the viewport. With no turn there are two, and every corner moves in a straight line, so the shape keeps
     * its outline the whole way.
     */
    export const computeClipKeyframes = (
        origin: Point2d,
        coverRadius: number,
        outline: Point2d[] | undefined,
        startDegrees = 0,
        endDegrees = 0,
    ): Keyframe[] => {
        if (!outline) {
            return [
                { clipPath: `circle(0px at ${pointPx(origin)})` },
                { clipPath: `circle(${px(coverRadius)} at ${pointPx(origin)})` },
            ];
        }

        const toPolygon = (points: Point2d[]) => `polygon(${points.map(pointPx).join(", ")})`;
        const turnDegrees = endDegrees - startDegrees;
        const stepCount = Math.max(1, Math.ceil(Math.abs(turnDegrees) / CLIP_STEP_DEGREES));

        return Array.from({ length: stepCount + 1 }, (_, step) => {
            const progress = step / stepCount;
            const points = rotateOutline(outline, startDegrees + turnDegrees * progress);

            return {
                clipPath: toPolygon(
                    points.map((point) => ({ x: origin.x + point.x * progress, y: origin.y + point.y * progress })),
                ),
            };
        });
    };

    /**
     * The frames of a soft-edged reveal, as a blurred image of the shape used as a mask and grown from nothing.
     *
     * The image is drawn once at its final size and scaled up from the origin, so the edge's softness grows with the
     * shape and is `blur` at the end. The image leaves room for the blur on every side, and the caller is expected to
     * have reached past the viewport by enough for the blur to fade out before the edge, as {@link computeKeyframes}
     * does.
     *
     * A shape that turns as it grows cannot be one image, since the browser swaps one mask image for the next rather
     * than blending them. It is drawn once for every 10ms of the reveal instead, each image turned a little further,
     * so the swaps come faster than the screen refreshes and read as a smooth turn. The images are all the same size —
     * a square wide enough for the shape at any angle — so the size and position keep moving smoothly between them.
     *
     * @param origin Where the shape grows from, in viewport pixels.
     * @param coverRadius How far the shape's nearest edge reaches at the end.
     * @param outline From {@link computeOutline}. Left out, a circle, which turning does not change.
     * @param blur How soft the edge is at the end, as the standard deviation in pixels, which is what CSS `blur()`
     * takes.
     * @param startDegrees The shape's angle as it starts to grow, clockwise.
     * @param endDegrees Its angle once it covers the viewport; equal to `startDegrees`, the shape is only tilted.
     * @param durationMs How long the reveal runs, which sets how many images a turn needs.
     * @returns Keyframes for `Element.animate`. With no turn there are two, both carrying the same `mask-image` and
     * moving only its size and position.
     */
    export const computeMaskKeyframes = (
        origin: Point2d,
        coverRadius: number,
        outline: Point2d[] | undefined,
        blur: number,
        startDegrees = 0,
        endDegrees = 0,
        durationMs = SHAPE_REVEAL_DEFAULTS.durationMs,
    ): Keyframe[] => {
        const pad = blur * BLUR_REACH;

        if (outline && endDegrees !== startDegrees) {
            const half = Math.max(...outline.map((point) => Math.hypot(point.x, point.y))) + pad;
            const side = half * 2;
            const turnDegrees = endDegrees - startDegrees;
            const frameCount = Math.max(1, Math.ceil(durationMs / MASK_FRAME_MS));

            return Array.from({ length: frameCount + 1 }, (_, frame) => {
                const progress = frame / frameCount;
                const points = rotateOutline(outline, startDegrees + turnDegrees * progress);

                return {
                    maskImage: toMaskImage(side, side, toBlurredPolygon(points, { x: half, y: half }, blur)),
                    maskRepeat: "no-repeat",
                    maskSize: `${px(side * progress)} ${px(side * progress)}`,
                    maskPosition: pointPx({ x: origin.x - half * progress, y: origin.y - half * progress }),
                };
            });
        }

        const tilted = outline && rotateOutline(outline, startDegrees);
        const bounds = computeBounds(tilted, coverRadius);
        const offset = { x: pad - bounds.minX, y: pad - bounds.minY };
        const width = bounds.maxX - bounds.minX + pad * 2;
        const height = bounds.maxY - bounds.minY + pad * 2;
        const shape = tilted
            ? toBlurredPolygon(tilted, offset, blur)
            : `<circle cx="${offset.x}" cy="${offset.y}" r="${coverRadius}" fill="black" style="filter:blur(${px(blur)})"/>`;
        const image = toMaskImage(width, height, shape);

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
     * @param softness How soft the edge is, from `0`, a hard edge through a `clip-path`, to `1`, a fade as wide as the
     * distance the shape grows to cover the viewport; anything above `0` is a mask. It is clamped to that range, and
     * because it is a share of that distance it looks the same on any window and from any origin.
     * @param startDegrees The shape's angle as it starts to grow, clockwise.
     * @param endDegrees Its angle once it covers the viewport; the turn between the two follows the reveal's own
     * timing and easing.
     * @param durationMs How long the reveal runs, which a soft-edged turn needs to know how many images to draw.
     * @returns Keyframes that also hold the new page fully opaque and unblended, which is what the browser's own
     * cross-fade would otherwise change — two when the shape does not turn, more when it does.
     */
    export const computeKeyframes = (
        origin: Point2d,
        size: Size2d,
        computePoints: ((size: Size2d) => Point2d[]) | undefined,
        softness: number,
        startDegrees = 0,
        endDegrees = 0,
        durationMs = SHAPE_REVEAL_DEFAULTS.durationMs,
    ): Keyframe[] => {
        const reach = computeFarthestDistance(origin, size);
        const blur = (MathUtils.clamp01(softness) * reach) / BLUR_REACH;
        const coverRadius = reach + blur * BLUR_REACH;
        const outline = computePoints ? computeOutline(computePoints, coverRadius) : undefined;
        const frames =
            blur > 0
                ? computeMaskKeyframes(origin, coverRadius, outline, blur, startDegrees, endDegrees, durationMs)
                : computeClipKeyframes(origin, coverRadius, outline, startDegrees, endDegrees);

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
     * and how soft its edge is (`softness`, from `0`, a hard edge, to `1`, as {@link computeKeyframes} takes it), and
     * the angle it starts at and ends at (`startDegrees` and `endDegrees`, clockwise: equal, the shape is only tilted;
     * apart, it turns from one to the other as it grows, on the reveal's own timing and easing, so the gap between them
     * over `durationMs` is the pace). Defaults are in `SHAPE_REVEAL_DEFAULTS`.
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
        const keyframes = computeKeyframes(
            origin,
            size,
            opts.computePoints,
            opts.softness ?? SHAPE_REVEAL_DEFAULTS.softness,
            opts.startDegrees ?? SHAPE_REVEAL_DEFAULTS.startDegrees,
            opts.endDegrees ?? SHAPE_REVEAL_DEFAULTS.endDegrees,
            durationMs,
        );

        const animations = [
            document.documentElement.animate(HOLD_KEYFRAMES, { ...timing, pseudoElement: OLD_PSEUDO_ELEMENT }),
            document.documentElement.animate(keyframes, { ...timing, pseudoElement: NEW_PSEUDO_ELEMENT }),
        ];
        const result = await hasFinished;

        animations.forEach((animation) => animation.cancel());

        return result;
    };
}
