import { MathUtils, type Point2d, ShapeUtils, type Size2d } from "@thewaver/ss-utils";

import type { CutoutMaskStyle } from "../../../Abstracts/Cutout/Cutout.types";
import { CutoutUtils } from "../../../Abstracts/Cutout/Cutout.utils";
import type { PointerReading } from "../../../Abstracts/PointerTracker/PointerTracker.types";

const NO_EDGE_THICKNESSES = [0];
const INSIDE_EDGE_RATIO = 1;
const NO_HOLE_RADIUS = 0;
const BLUR_SPREAD = 3;
const BLUR_MARGIN = 2;
const HALF = 0.5;

const NUDGE_KEYS: Record<string, Point2d | undefined> = {
    ArrowRight: { x: 1, y: 0 },
    ArrowLeft: { x: -1, y: 0 },
    ArrowDown: { x: 0, y: 1 },
    ArrowUp: { x: 0, y: -1 },
};

const clampInto = (point: Point2d, size: Size2d): Point2d => ({
    x: MathUtils.clamp(point.x, 0, size.width),
    y: MathUtils.clamp(point.y, 0, size.height),
});

/**
 * Where a reveal's window is and what it looks like: the soft-edged image cut into the cover, the rules for when the
 * window is open, and how the arrow keys move it.
 *
 * The window follows the pointer while it is over the element, and the keyboard while the element was reached with
 * it; a framework's view holds the keyboard's point and the pointer reading, and asks these what to draw.
 */
export namespace RevealUtils {
    /**
     * The window's image, as a CSS `url()` of an SVG blurred towards its edge.
     *
     * The shape is drawn inset by twice its blur, so the fade stays inside the image's box rather than being cut
     * off at it.
     *
     * @param radius Half the window's width and height.
     * @param softness `0` for a fade as wide as the window, `1` for a hard edge.
     * @param computePoints The window's contour, worked out from its size. Left out, a circle.
     * @param joinRadii How far each corner of the contour is rounded, as `Shape` takes it.
     * @param lameExponents How square or pinched each rounded corner is, as `Shape` takes it.
     * @returns A value ready for `mask-image`, quoted, since the data carries characters an unquoted `url()` refuses.
     */
    export const buildHoleImage = (
        radius: number,
        softness: number,
        computePoints: ((size: Size2d) => Point2d[]) | undefined,
        joinRadii: number[] | undefined,
        lameExponents: number[] | undefined,
    ) => {
        const size = radius * 2;
        const blur = ((1 - softness) * radius) / BLUR_SPREAD;
        const inset = blur * BLUR_MARGIN;
        const side = Math.max(size - inset * 2, 0);
        const points = computePoints?.({ width: side, height: side });
        const paint = `fill="black" style="filter:blur(${blur}px)"`;
        const shape = points
            ? `<path d="${ShapeUtils.getPaths(points, NO_EDGE_THICKNESSES, joinRadii, lameExponents).outerPath}" transform="translate(${inset}, ${inset})" ${paint}/>`
            : `<circle cx="${radius}" cy="${radius}" r="${side * HALF}" ${paint}/>`;
        const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}">${shape}</svg>`;

        return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
    };

    /**
     * Whether the pointer is over the element.
     *
     * @param isPointerPresent Whether the pointer is over the window at all.
     * @param reading Where it is relative to the element.
     */
    export const getIsPointerInside = (isPointerPresent: boolean, reading: PointerReading) =>
        isPointerPresent && reading.edgeRatio <= INSIDE_EDGE_RATIO;

    /**
     * Where the pointer is, in the element's own pixels.
     *
     * @param reading Where it is relative to the element.
     * @param size The element's size.
     */
    export const toPointerPoint = (reading: PointerReading, size: Size2d): Point2d => ({
        x: reading.boxRatio.x * size.width,
        y: reading.boxRatio.y * size.height,
    });

    /**
     * The middle of the element, where a window opened from the keyboard starts.
     *
     * @param size The element's size.
     */
    export const toCenter = (size: Size2d): Point2d => ({ x: size.width * HALF, y: size.height * HALF });

    /**
     * Whether the window is open, which is what the cover is told.
     *
     * @param isDisabled Whether the reveal is turned off.
     * @param isKeyboardDriven Whether the keyboard holds the window.
     * @param isPointerInside From {@link getIsPointerInside}.
     */
    export const getIsRevealing = (isDisabled: boolean, isKeyboardDriven: boolean, isPointerInside: boolean) =>
        isKeyboardDriven || (!isDisabled && isPointerInside);

    /**
     * Whether a hole is cut at all.
     *
     * A hole is cut whenever the pointer is anywhere on the page, not only over the element, so it can slide in from
     * the edge rather than appear.
     *
     * @param isDisabled Whether the reveal is turned off.
     * @param isKeyboardDriven Whether the keyboard holds the window.
     * @param isPointerPresent Whether the pointer is over the window at all.
     * @param radius The window's radius. A window of no size cuts nothing.
     */
    export const getHasHole = (
        isDisabled: boolean,
        isKeyboardDriven: boolean,
        isPointerPresent: boolean,
        radius: number,
    ) => (isKeyboardDriven || (!isDisabled && isPointerPresent)) && radius > NO_HOLE_RADIUS;

    /**
     * Where the window's center is.
     *
     * @param keyboardPoint The keyboard's point, while the keyboard holds the window.
     * @param pointerPoint The pointer's point, from {@link toPointerPoint}.
     * @param size The element's size, which the keyboard's point is held inside.
     */
    export const computeHoleCenter = (keyboardPoint: Point2d | undefined, pointerPoint: Point2d, size: Size2d) =>
        keyboardPoint ? clampInto(keyboardPoint, size) : pointerPoint;

    /**
     * The mask handed to the cover.
     *
     * @param hasHole From {@link getHasHole}. Without a hole the mask is empty and the cover paints whole.
     * @param center Where the window's center is.
     * @param radius Half its width and height.
     * @param image From {@link buildHoleImage}.
     * @returns `CutoutUtils.getMaskStyle` for the one hole, keyed by hyphenated CSS names, or an empty record
     * without a hole.
     */
    export const computeMaskStyle = (
        hasHole: boolean,
        center: Point2d,
        radius: number,
        image: string,
    ): Partial<CutoutMaskStyle> => {
        if (!hasHole) return {};

        const diameter = radius * 2;

        return CutoutUtils.getMaskStyle([
            { x: center.x - radius, y: center.y - radius, width: diameter, height: diameter, image },
        ]);
    };

    /**
     * Which way a key press moves the window.
     *
     * @param e The key press. Any of Alt, Control or Meta held leaves the key to the browser.
     * @returns One step's direction for an arrow key, or `undefined` for anything else.
     */
    export const getNudge = (e: Pick<KeyboardEvent, "key" | "altKey" | "ctrlKey" | "metaKey">) =>
        e.altKey || e.ctrlKey || e.metaKey ? undefined : NUDGE_KEYS[e.key];

    /**
     * Where one press of an arrow puts the window.
     *
     * @param from Where the window is now: the keyboard's point, the pointer's if it is over the element, or the
     * center.
     * @param nudge From {@link getNudge}.
     * @param stepSize How far one press moves it.
     * @param size The element's size, which the result is held inside.
     */
    export const computeNudgedPoint = (from: Point2d, nudge: Point2d, stepSize: number, size: Size2d) =>
        clampInto({ x: from.x + nudge.x * stepSize, y: from.y + nudge.y * stepSize }, size);
}
