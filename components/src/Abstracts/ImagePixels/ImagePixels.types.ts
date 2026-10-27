import type { Index2d, Rect } from "@thewaver/ss-utils";

export type ImagePixels = {
    /** The pixels across. */
    width: number;
    /** The pixels down. */
    height: number;
    /** Red, green, blue and alpha of each pixel, `0`–`255`, row by row, as a canvas hands them over. */
    data: ArrayLike<number>;
};

export type ImagePixelCell = {
    /** The average red, `0`–`255`, counting each pixel by how opaque it is. */
    red: number;
    /** The average green, `0`–`255`, counting each pixel by how opaque it is. */
    green: number;
    /** The average blue, `0`–`255`, counting each pixel by how opaque it is. */
    blue: number;
    /** The average opacity, `0` for fully transparent to `1` for fully opaque. */
    alpha: number;
};

export type ImagePixelGrid = {
    /** How many cells the grid has, across and down. */
    count: Index2d;
    /** Each cell's average, row by row. */
    cells: ImagePixelCell[];
};

export type ImageFitMapping = {
    /** The part of the picture that shows, in the picture's own pixels. */
    source: Rect;
    /** Where that part lands in the box, in the box's pixels. */
    dest: Rect;
};

export type ImagePositionLength = {
    /** The number. */
    value: number;
    /** Whether it is a percentage of the room left over, or a distance in pixels from the box's edge. */
    isPercent: boolean;
};
