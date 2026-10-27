import { type Index2d, MathUtils, type Point2d, type Size2d } from "@thewaver/ss-utils";

import type {
    ImageFitMapping,
    ImagePixelCell,
    ImagePixelGrid,
    ImagePixels,
    ImagePositionLength,
} from "./ImagePixels.types";

const GRID_LONGEST_SIDE = 96;
const OVERSAMPLE = 4;
const HAVE_CURRENT_DATA = 2;
const MAX_ALPHA = 255;
const DEFAULT_ALPHA_THRESHOLD = 0.5;
const CENTER: ImagePositionLength[] = [
    { value: 50, isPercent: true },
    { value: 50, isPercent: true },
];

const parseLength = (token: string): ImagePositionLength | undefined => {
    const value = Number.parseFloat(token);

    if (Number.isNaN(value)) return undefined;

    return { value, isPercent: token.trim().endsWith("%") };
};

const computeOffset = (length: ImagePositionLength, free: number) =>
    length.isPercent ? (free * length.value) / 100 : length.value;

const readNaturalSize = (source: HTMLImageElement | HTMLCanvasElement | HTMLVideoElement): Size2d | undefined => {
    if (source instanceof HTMLImageElement) {
        return source.complete && source.naturalWidth > 0
            ? { width: source.naturalWidth, height: source.naturalHeight }
            : undefined;
    }

    if (source instanceof HTMLVideoElement) {
        return source.readyState >= HAVE_CURRENT_DATA && source.videoWidth > 0
            ? { width: source.videoWidth, height: source.videoHeight }
            : undefined;
    }

    return source.width > 0 && source.height > 0 ? { width: source.width, height: source.height } : undefined;
};

/**
 * Reading the colors of a picture: where a replaced element's picture lands in its box, the average color of each
 * cell of a grid laid over it, and the browser step that gets the pixels.
 *
 * Everything but {@link read} is plain arithmetic on numbers, so it is checked without a page.
 */
export namespace ImagePixelsUtils {
    /**
     * Reads a CSS `object-position`.
     *
     * @param value A computed `object-position`, such as `"50% 50%"` or `"10px 20px"`.
     * @returns The horizontal and the vertical length. A value that cannot be read answers the center.
     */
    export const parseObjectPosition = (value: string): ImagePositionLength[] => {
        const [first, second] = value.trim().split(/\s+/);
        const x = first === undefined ? undefined : parseLength(first);
        const y = second === undefined ? undefined : parseLength(second);

        return x && y ? [x, y] : CENTER;
    };

    /**
     * Where a picture lands in its box, the way CSS `object-fit` and `object-position` place it.
     *
     * Only the part of the picture that falls inside the box is answered, so the result is exactly what is drawn: the
     * crop of the picture to take and the rectangle of the box it fills.
     *
     * @param source The picture's own size.
     * @param box The size of the box it is shown in.
     * @param fit A computed `object-fit`: `fill`, `contain`, `cover`, `none` or `scale-down`. Anything else is `fill`.
     * @param position A computed `object-position`.
     * @returns The mapping, or `undefined` when either size has no extent or none of the picture shows.
     */
    export const computeFit = (
        source: Size2d,
        box: Size2d,
        fit: string,
        position: string,
    ): ImageFitMapping | undefined => {
        if (source.width <= 0 || source.height <= 0 || box.width <= 0 || box.height <= 0) return undefined;

        const containScale = Math.min(box.width / source.width, box.height / source.height);
        const coverScale = Math.max(box.width / source.width, box.height / source.height);
        const scale = (() => {
            switch (fit) {
                case "contain":
                    return { x: containScale, y: containScale };
                case "cover":
                    return { x: coverScale, y: coverScale };
                case "none":
                    return { x: 1, y: 1 };
                case "scale-down": {
                    const down = Math.min(1, containScale);

                    return { x: down, y: down };
                }
                default:
                    return { x: box.width / source.width, y: box.height / source.height };
            }
        })();

        const [positionX, positionY] = parseObjectPosition(position) as [ImagePositionLength, ImagePositionLength];
        const shown = { width: source.width * scale.x, height: source.height * scale.y };
        const offset = {
            x: computeOffset(positionX, box.width - shown.width),
            y: computeOffset(positionY, box.height - shown.height),
        };
        const left = Math.max(offset.x, 0);
        const top = Math.max(offset.y, 0);
        const right = Math.min(offset.x + shown.width, box.width);
        const bottom = Math.min(offset.y + shown.height, box.height);

        if (right <= left || bottom <= top) return undefined;

        return {
            source: {
                x: (left - offset.x) / scale.x,
                y: (top - offset.y) / scale.y,
                width: (right - left) / scale.x,
                height: (bottom - top) / scale.y,
            },
            dest: { x: left, y: top, width: right - left, height: bottom - top },
        };
    };

    /**
     * How many cells a grid laid over a box has.
     *
     * The longest side gets 96 cells and the other as many as keep the cells square, so a grid is the same fineness
     * whatever the picture's size, and never has fewer than one cell on a side.
     *
     * @param box The size of the box.
     * @returns The cell count, across and down.
     */
    export const computeGridCount = (box: Size2d): Index2d => {
        const longest = Math.max(box.width, box.height);

        if (longest <= 0) return { col: 1, row: 1 };

        const side = longest / GRID_LONGEST_SIDE;

        return {
            col: MathUtils.clamp(Math.round(box.width / side), 1, GRID_LONGEST_SIDE),
            row: MathUtils.clamp(Math.round(box.height / side), 1, GRID_LONGEST_SIDE),
        };
    };

    /**
     * The average color of each cell of a grid laid over some pixels.
     *
     * A pixel counts in proportion to how opaque it is, so a mostly transparent cell holding one red pixel is red and
     * not gray, and its opacity says how little of it is painted.
     *
     * @param pixels The pixels, as a canvas hands them over.
     * @param count How many cells the grid has, across and down.
     * @returns One entry per cell, row by row. A cell with no opaque pixel is black with an alpha of `0`.
     */
    export const computeCellAverages = (pixels: ImagePixels, count: Index2d): ImagePixelGrid => {
        const cells: ImagePixelCell[] = [];

        for (let row = 0; row < count.row; row++) {
            const top = Math.floor((row * pixels.height) / count.row);
            const bottom = Math.max(top + 1, Math.floor(((row + 1) * pixels.height) / count.row));

            for (let col = 0; col < count.col; col++) {
                const left = Math.floor((col * pixels.width) / count.col);
                const right = Math.max(left + 1, Math.floor(((col + 1) * pixels.width) / count.col));

                let red = 0;
                let green = 0;
                let blue = 0;
                let alpha = 0;
                let total = 0;

                for (let y = top; y < Math.min(bottom, pixels.height); y++) {
                    for (let x = left; x < Math.min(right, pixels.width); x++) {
                        const at = (y * pixels.width + x) * 4;
                        const weight = pixels.data[at + 3] ?? 0;

                        red += (pixels.data[at] ?? 0) * weight;
                        green += (pixels.data[at + 1] ?? 0) * weight;
                        blue += (pixels.data[at + 2] ?? 0) * weight;
                        alpha += weight;
                        total += 1;
                    }
                }

                cells.push(
                    alpha > 0
                        ? {
                              red: red / alpha,
                              green: green / alpha,
                              blue: blue / alpha,
                              alpha: alpha / (total * MAX_ALPHA),
                          }
                        : { red: 0, green: 0, blue: 0, alpha: 0 },
                );
            }
        }

        return { count, cells };
    };

    /**
     * The color of a grid at a point.
     *
     * @param grid From {@link computeCellAverages}.
     * @param share The point as a share of the grid's width and height, `0`–`1` on each axis.
     * @param alphaThreshold How opaque the cell must be to count as painted. Left out, one half.
     * @returns The cell's color as CSS writes it, or `undefined` where the cell is more transparent than the threshold.
     */
    export const computeColorAt = (
        grid: ImagePixelGrid,
        share: Point2d,
        alphaThreshold: number = DEFAULT_ALPHA_THRESHOLD,
    ) => {
        const col = MathUtils.clamp(Math.floor(share.x * grid.count.col), 0, grid.count.col - 1);
        const row = MathUtils.clamp(Math.floor(share.y * grid.count.row), 0, grid.count.row - 1);
        const cell = grid.cells[row * grid.count.col + col];

        if (!cell || cell.alpha < alphaThreshold || cell.alpha <= 0) return undefined;

        return `rgb(${Math.round(cell.red)}, ${Math.round(cell.green)}, ${Math.round(cell.blue)})`;
    };

    /**
     * Reads the colors of what a replaced element is showing.
     *
     * Draws the element, placed as its `object-fit` and `object-position` place it, into a canvas a few times finer than
     * the grid, and averages each cell. It reads what is on screen now: the loaded image, the canvas as drawn so far,
     * the video's current frame.
     *
     * A picture from another origin only gives up its pixels when the page asked for it with `crossorigin` on the element
     * and the server agreed with `Access-Control-Allow-Origin`; otherwise the browser refuses to hand them back, and so
     * does this.
     *
     * @param source The image, canvas or video.
     * @param box The size of the box the picture is shown in, in pixels.
     * @param fit The element's computed `object-fit`.
     * @param position The element's computed `object-position`.
     * @returns The grid, or `undefined` when there is nothing to read yet (an image still loading, a video with no
     * frame), nothing shows in the box, or the browser refuses the pixels.
     */
    export const read = (
        source: HTMLImageElement | HTMLCanvasElement | HTMLVideoElement,
        box: Size2d,
        fit: string,
        position: string,
    ): ImagePixelGrid | undefined => {
        const natural = readNaturalSize(source);
        const mapping = natural ? computeFit(natural, box, fit, position) : undefined;

        if (!mapping) return undefined;

        const count = computeGridCount(box);
        const canvas = document.createElement("canvas");

        canvas.width = count.col * OVERSAMPLE;
        canvas.height = count.row * OVERSAMPLE;

        const context = canvas.getContext("2d", { willReadFrequently: true });

        if (!context) return undefined;

        const scaleX = canvas.width / box.width;
        const scaleY = canvas.height / box.height;

        context.imageSmoothingQuality = "high";
        context.drawImage(
            source,
            mapping.source.x,
            mapping.source.y,
            mapping.source.width,
            mapping.source.height,
            mapping.dest.x * scaleX,
            mapping.dest.y * scaleY,
            mapping.dest.width * scaleX,
            mapping.dest.height * scaleY,
        );

        try {
            return computeCellAverages(context.getImageData(0, 0, canvas.width, canvas.height), count);
        } catch {
            return undefined;
        }
    };
}
