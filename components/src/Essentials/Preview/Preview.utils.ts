/** The part of a preview that is not about drawing it: whether there is anything to open, and how tall to be. */
export namespace PreviewUtils {
    /**
     * Whether the content runs past the height the preview was given, which is the only case with anything to open.
     *
     * Content not yet measured reads as fitting, so no control flashes up before the first measurement lands.
     *
     * @param contentHeight The content's measured height, or `0` before it has been measured.
     * @param collapsedHeight How much of the content is shown while collapsed.
     * @returns Whether the content is taller than that.
     */
    export const computeIsOverflowing = (contentHeight: number, collapsedHeight: number) =>
        contentHeight > 0 && contentHeight > collapsedHeight;

    /**
     * How tall the clipped box is.
     *
     * The content's own height while opening or open, and also while it fits, so short content takes only the room
     * it needs; the collapsed height otherwise, and before anything has been measured.
     *
     * @param contentHeight The content's measured height, or `0` before it has been measured.
     * @param collapsedHeight How much of the content is shown while collapsed.
     * @param visibilityTarget Where the fade is heading: `1` open, `0` shut.
     * @returns The height, in pixels.
     */
    export const computeHeight = (contentHeight: number, collapsedHeight: number, visibilityTarget: 0 | 1) => {
        if (contentHeight <= 0) return collapsedHeight;

        return visibilityTarget === 1 || !computeIsOverflowing(contentHeight, collapsedHeight)
            ? contentHeight
            : collapsedHeight;
    };

    /**
     * Where the fade over the cut-off edge is heading, which is always the opposite of the content's.
     *
     * @param visibilityTarget Where the content's fade is heading.
     * @returns `1` while the content is shut, so the fade shows, and `0` while it is open.
     */
    export const computeOverlayTarget = (visibilityTarget: 0 | 1): 0 | 1 => (visibilityTarget === 1 ? 0 : 1);
}
