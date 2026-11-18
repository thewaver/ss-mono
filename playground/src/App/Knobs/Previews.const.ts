export namespace PreviewKnobs {
    export const MIN_COLLAPSED_HEIGHT = 40;
    export const MAX_COLLAPSED_HEIGHT = 400;
    export const COLLAPSED_HEIGHT_STEP = 10;

    export const COLLAPSED_HEIGHT_TEXT = {
        label: "Collapsed height (px)",
        hint: "How much of the content shows while the preview is closed.",
        controls: "Sets PreviewProps.collapsedHeight",
    };

    export const IS_SCROLLED_INTO_VIEW_ON_COLLAPSE_TEXT = {
        label: "Scroll into view on collapse",
        hint: "Whether closing the preview scrolls it back into view.",
        controls: "Sets PreviewProps.isScrolledIntoViewOnCollapse",
    };
}
