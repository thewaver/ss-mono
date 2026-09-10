import type { Rect } from "@thewaver/ss-utils";

/** Cuts a rectangular hole in a covering overlay. */
export namespace SpotlightUtils {
    /**
     * The clip path for an overlay with a hole in it.
     *
     * Two rectangles in one path — the whole overlay and the hole — with the even-odd fill rule, which
     * counts the area inside both as outside the shape. That is what leaves a hole rather than an
     * overlapping square, and it is why the outer ring is traced one way and the inner one the other.
     *
     * @param rect The hole, in the overlay's own coordinates.
     * @returns A `polygon()` value for `clip-path`.
     */
    export const getHoleClipPath = (rect: Rect) => {
        const right = rect.x + rect.width;
        const bottom = rect.y + rect.height;
        const outer = "0 0, 0 100%, 100% 100%, 100% 0, 0 0";
        const inner = [
            `${rect.x}px ${rect.y}px`,
            `${right}px ${rect.y}px`,
            `${right}px ${bottom}px`,
            `${rect.x}px ${bottom}px`,
            `${rect.x}px ${rect.y}px`,
        ].join(", ");

        return `polygon(evenodd, ${outer}, ${inner}, 0 0)`;
    };
}
