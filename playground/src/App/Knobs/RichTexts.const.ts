export namespace RichTextKnobs {
    export const REMOVE_OTHER_TAGS_TEXT = {
        label: "Remove other tags",
        hint: "Strips any tag the editor was not told to keep, rather than leaving it in the markup untouched.",
        controls: "Sets RichTextProps.removeOtherTags",
    };

    export const MAX_DEPTH_TEXT = {
        label: "Max depth (-1 = no limit)",
        hint: "How deeply tags may nest. A tag deeper than this prints as typed, and 0 allows no tags.",
        controls: "Sets RichTextProps.maxDepth, with -1 sent as Infinity",
    };
}
