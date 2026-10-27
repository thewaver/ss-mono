import type { Point2d, Rect } from "@thewaver/ss-utils";

import { ImagePixelsUtils } from "../ImagePixels/ImagePixels.utils";
import type { PaintedRegion, PaintedRegionRadii, PaintedSample } from "./PaintedArea.types";

const NON_PAINTING_TAGS = new Set([
    "script",
    "style",
    "noscript",
    "template",
    "head",
    "meta",
    "link",
    "defs",
    "clippath",
    "mask",
    "marker",
    "pattern",
    "symbol",
    "lineargradient",
    "radialgradient",
    "filter",
    "title",
    "desc",
    "metadata",
]);
const REPLACED_TAGS = new Set(["iframe", "object", "embed", "input", "textarea", "select"]);
const BORDER_SIDES = ["Top", "Right", "Bottom", "Left"] as const;
const HIDDEN_BORDER_STYLES = new Set(["none", "hidden"]);
const NO_PAINT = "none";
const NOTHING = undefined;
const TRANSPARENT = "transparent";
const NO_RADII: PaintedRegionRadii = [0, 0, 0, 0];
const DEFAULT_SAMPLES_PER_AXIS = 3;
const ALPHA_AFTER_SLASH = /\/\s*([\d.]+)(%?)\s*\)$/;
const LEGACY_RGBA = /^rgba\(\s*[^,]+,\s*[^,]+,\s*[^,]+,\s*([\d.]+)(%?)\s*\)$/;

const getIsOutsideCorner = (local: Point2d, center: Point2d, radius: number, directionX: number, directionY: number) =>
    radius > 0 &&
    (local.x - center.x) * directionX > 0 &&
    (local.y - center.y) * directionY > 0 &&
    Math.hypot(local.x - center.x, local.y - center.y) > radius;

const getIsInRoundedRect = (rect: Rect, radii: PaintedRegionRadii, point: Point2d) => {
    if (point.x < rect.x || point.x > rect.x + rect.width || point.y < rect.y || point.y > rect.y + rect.height) {
        return false;
    }

    const local = { x: point.x - rect.x, y: point.y - rect.y };
    const [topLeft, topRight, bottomRight, bottomLeft] = radii;

    return !(
        getIsOutsideCorner(local, { x: topLeft, y: topLeft }, topLeft, -1, -1) ||
        getIsOutsideCorner(local, { x: rect.width - topRight, y: topRight }, topRight, 1, -1) ||
        getIsOutsideCorner(local, { x: rect.width - bottomRight, y: rect.height - bottomRight }, bottomRight, 1, 1) ||
        getIsOutsideCorner(local, { x: bottomLeft, y: rect.height - bottomLeft }, bottomLeft, -1, 1)
    );
};

const getIsRegionPainted = (region: PaintedRegion, point: Point2d) => {
    if (region.getIsInside) return getIsInRoundedRect(region.rect, NO_RADII, point) && region.getIsInside(point);

    if (!getIsInRoundedRect(region.rect, region.radii, point)) return false;

    return region.getColorAt === undefined || region.getColorAt(point) !== NOTHING;
};

const readIsColorTransparent = (color: string) => {
    const text = color.trim().toLowerCase();

    if (text === TRANSPARENT) return true;

    const afterSlash = ALPHA_AFTER_SLASH.exec(text);

    if (afterSlash) return Number.parseFloat(afterSlash[1] ?? "1") === 0;

    const legacy = LEGACY_RGBA.exec(text);

    return legacy ? Number.parseFloat(legacy[1] ?? "1") === 0 : false;
};

const parseRadius = (value: string, length: number) => {
    const token = value.trim().split(/\s+/)[0] ?? "";
    const number = Number.parseFloat(token);

    if (Number.isNaN(number)) return 0;

    return token.endsWith("%") ? (number * length) / 100 : number;
};

const clampRadii = (radii: PaintedRegionRadii, size: { width: number; height: number }): PaintedRegionRadii => {
    const [topLeft, topRight, bottomRight, bottomLeft] = radii;
    const limits = [
        topLeft + topRight > 0 ? size.width / (topLeft + topRight) : 1,
        bottomLeft + bottomRight > 0 ? size.width / (bottomLeft + bottomRight) : 1,
        topLeft + bottomLeft > 0 ? size.height / (topLeft + bottomLeft) : 1,
        topRight + bottomRight > 0 ? size.height / (topRight + bottomRight) : 1,
    ];
    const factor = Math.min(1, ...limits);

    return [topLeft * factor, topRight * factor, bottomRight * factor, bottomLeft * factor];
};

/**
 * Where a piece of content is painted: the boxes of its text lines, the boxes of elements with a background or a
 * border, the shapes of SVG, the pixels of images, canvases and video, and nothing for what paints nothing.
 *
 * It is approximate by agreement. Inside a gradient, or an image the browser will not hand the pixels of, transparency
 * cannot be seen, so the whole box counts as painted, in the element's background color or its text color; a clipped or
 * masked element is read as if it were not.
 */
export namespace PaintedAreaUtils {
    /**
     * Whether a color paints nothing.
     *
     * Reads the forms a computed style can give: `transparent`, `rgba()` with an alpha of 0, and any modern function
     * ending in `/ 0`.
     *
     * @param color A computed color value.
     * @returns `true` when the alpha is exactly 0.
     */
    export const getIsColorTransparent = readIsColorTransparent;

    /**
     * One corner radius of a computed style, in pixels.
     *
     * @param value A computed `border-*-radius`, such as `"12px"`, `"50%"` or `"12px 8px"`. Only the first of two
     * values is read, so an elliptical corner is rounded as a circular one.
     * @param length The box side a percentage refers to.
     * @returns The radius, or `0` for a value that is not a length.
     */
    export const parseCornerRadius = parseRadius;

    /**
     * The corner radii a browser would draw, with the same reduction CSS applies when neighboring corners ask for
     * more than their side has.
     *
     * @param radii Top left, top right, bottom right and bottom left, as asked for.
     * @param size The box.
     * @returns The radii, all scaled down together by the tightest side.
     */
    export const clampCornerRadii = clampRadii;

    /**
     * Whether a point is inside a box with rounded corners.
     *
     * @param rect The box.
     * @param radii Top left, top right, bottom right and bottom left. A radius of `0` is a square corner.
     * @param point The point, in the box's coordinates.
     * @returns `true` for a point on the box or inside it, outside every rounded corner.
     */
    export const getIsPointInRoundedRect = getIsInRoundedRect;

    /**
     * The region that paints a point, the later one winning where several overlap.
     *
     * @param regions From {@link measure}, in paint order.
     * @param point The point, in the regions' coordinates.
     * @returns The topmost region painting there, or `undefined` for a point nothing paints.
     */
    export const findRegionAt = (regions: PaintedRegion[], point: Point2d) =>
        regions.findLast((region) => getIsRegionPainted(region, point));

    /**
     * The color a region paints at a point.
     *
     * @param region One of the regions {@link measure} answers.
     * @param point A point the region paints, in the regions' coordinates.
     * @returns The picture's color there for a picture, and the region's one color otherwise.
     */
    export const getRegionColor = (region: PaintedRegion, point: Point2d) => region.getColorAt?.(point) ?? region.color;

    /**
     * The painted points within a box, found by testing a grid of points evenly spread across it.
     *
     * A cell can be wider than the text line running through it, and its center can fall between two lines, so one
     * point per cell would miss it. Sampling several finds the painted part.
     *
     * @param regions From {@link measure}.
     * @param rect The box to sample, in the regions' coordinates.
     * @param perAxis How many points across and down. Left out, 3.
     * @returns Each sampled point that something paints, with that thing's color. Empty for a box nothing paints.
     */
    export const computeSamples = (
        regions: PaintedRegion[],
        rect: Rect,
        perAxis: number = DEFAULT_SAMPLES_PER_AXIS,
    ): PaintedSample[] => {
        const samples: PaintedSample[] = [];

        for (let row = 0; row < perAxis; row++) {
            for (let col = 0; col < perAxis; col++) {
                const pos = {
                    x: rect.x + ((col + 0.5) / perAxis) * rect.width,
                    y: rect.y + ((row + 0.5) / perAxis) * rect.height,
                };
                const region = findRegionAt(regions, pos);

                if (region) samples.push({ pos, color: getRegionColor(region, pos) });
            }
        }

        return samples;
    };

    /**
     * Reads where an element is painted.
     *
     * Walks everything inside it, skipping what is not shown, and collects the line boxes of its text, the box of every
     * element with a visible background or a border (less its rounded corners), the box of an iframe or form field, the
     * pixels of an image, canvas or video, and every SVG shape that has a fill or a stroke, which is tested point by
     * point against the shape itself. Reads the page as it is now, so call it when the answer is wanted rather than ahead
     * of time.
     *
     * Coordinates are layout pixels from the element's top left corner, with a scaling ancestor such as `Viewport`
     * divided out.
     *
     * @param root The element to read, which is read too.
     * @returns The regions in paint order, so a later one is on top of an earlier one.
     */
    export const measure = (root: HTMLElement): PaintedRegion[] => {
        const rootRect = root.getBoundingClientRect();
        const scale = root.offsetWidth > 0 && rootRect.width > 0 ? rootRect.width / root.offsetWidth : 1;
        const regions: PaintedRegion[] = [];

        const toLocalRect = (rect: DOMRectReadOnly): Rect => ({
            x: (rect.left - rootRect.left) / scale,
            y: (rect.top - rootRect.top) / scale,
            width: rect.width / scale,
            height: rect.height / scale,
        });

        const readText = (node: Text, parentStyle: CSSStyleDeclaration) => {
            if (parentStyle.visibility === "hidden" || node.data.trim() === "") return;

            const range = document.createRange();

            range.selectNodeContents(node);

            for (const rect of range.getClientRects()) {
                if (rect.width > 0 && rect.height > 0) {
                    regions.push({ rect: toLocalRect(rect), radii: NO_RADII, color: parentStyle.color });
                }
            }
        };

        const readSvgShape = (element: SVGGeometryElement, style: CSSStyleDeclaration) => {
            const hasFill = style.fill !== NO_PAINT && !readIsColorTransparent(style.fill);
            const hasStroke =
                style.stroke !== NO_PAINT &&
                !readIsColorTransparent(style.stroke) &&
                Number.parseFloat(style.strokeWidth) > 0;
            const matrix = element.getScreenCTM();

            if ((!hasFill && !hasStroke) || !matrix) return;

            const inverse = matrix.inverse();

            regions.push({
                rect: toLocalRect(element.getBoundingClientRect()),
                radii: NO_RADII,
                color: hasFill ? style.fill : style.stroke,
                getIsInside: (point) => {
                    const local = new DOMPoint(
                        rootRect.left + point.x * scale,
                        rootRect.top + point.y * scale,
                    ).matrixTransform(inverse);

                    return (hasFill && element.isPointInFill(local)) || (hasStroke && element.isPointInStroke(local));
                },
            });
        };

        const readMedia = (
            element: HTMLImageElement | HTMLCanvasElement | HTMLVideoElement,
            style: CSSStyleDeclaration,
            rect: Rect,
            radii: PaintedRegionRadii,
        ): PaintedRegion | undefined => {
            const inset = (side: (typeof BORDER_SIDES)[number]) =>
                Number.parseFloat(style[`border${side}Width`]) + Number.parseFloat(style[`padding${side}`]);
            const content = {
                x: rect.x + inset("Left"),
                y: rect.y + inset("Top"),
                width: rect.width - inset("Left") - inset("Right"),
                height: rect.height - inset("Top") - inset("Bottom"),
            };

            if (!(content.width > 0 && content.height > 0)) return undefined;

            const grid = ImagePixelsUtils.read(
                element,
                { width: content.width, height: content.height },
                style.objectFit,
                style.objectPosition,
            );

            if (!grid) return undefined;

            return {
                rect: content,
                radii,
                color: style.color,
                getColorAt: (point) =>
                    ImagePixelsUtils.computeColorAt(grid, {
                        x: (point.x - content.x) / content.width,
                        y: (point.y - content.y) / content.height,
                    }),
            };
        };

        const readBox = (element: Element, style: CSSStyleDeclaration) => {
            const rect = toLocalRect(element.getBoundingClientRect());

            if (rect.width <= 0 || rect.height <= 0) return;

            const hasBackgroundColor = !readIsColorTransparent(style.backgroundColor);
            const hasBackground = hasBackgroundColor || style.backgroundImage !== NO_PAINT;
            const borderColor = BORDER_SIDES.map((side) => ({
                width: Number.parseFloat(style[`border${side}Width`]),
                style: style[`border${side}Style`],
                color: style[`border${side}Color`],
            })).find(
                (side) =>
                    side.width > 0 && !HIDDEN_BORDER_STYLES.has(side.style) && !readIsColorTransparent(side.color),
            )?.color;
            const radii = clampRadii(
                [
                    parseRadius(style.borderTopLeftRadius, rect.width),
                    parseRadius(style.borderTopRightRadius, rect.width),
                    parseRadius(style.borderBottomRightRadius, rect.width),
                    parseRadius(style.borderBottomLeftRadius, rect.width),
                ],
                rect,
            );
            const isMedia =
                element instanceof HTMLImageElement ||
                element instanceof HTMLCanvasElement ||
                element instanceof HTMLVideoElement;
            const media = isMedia ? readMedia(element, style, rect, radii) : undefined;
            const isReplaced = REPLACED_TAGS.has(element.localName) || (isMedia && !media);

            if (hasBackground || borderColor !== undefined || isReplaced) {
                regions.push({
                    rect,
                    radii,
                    color: hasBackgroundColor ? style.backgroundColor : (borderColor ?? style.color),
                });
            }

            if (media) regions.push(media);
        };

        const visit = (node: Node, parentStyle: CSSStyleDeclaration | undefined) => {
            if (node instanceof Text) {
                if (parentStyle) readText(node, parentStyle);

                return;
            }

            if (!(node instanceof Element) || NON_PAINTING_TAGS.has(node.localName)) return;

            const style = getComputedStyle(node);

            if (style.display === "none" || Number.parseFloat(style.opacity) === 0) return;

            if (style.visibility !== "hidden" && style.visibility !== "collapse") {
                if (node instanceof SVGGeometryElement) readSvgShape(node, style);
                else if (!(node instanceof SVGElement)) readBox(node, style);
            }

            for (const child of node.childNodes) visit(child, style);
        };

        visit(root, undefined);

        return regions;
    };
}
