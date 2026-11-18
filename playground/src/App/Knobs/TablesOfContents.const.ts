export namespace TableOfContentsKnobs {
    export const MIN_OFFSET_RATIO = 0;
    export const MAX_OFFSET_RATIO = 1;
    export const OFFSET_RATIO_STEP = 0.05;

    export const OFFSET_RATIO_TEXT = {
        label: "Offset ratio",
        hint: "How far down the box the line sits that decides which section is current, as a share of its height. A section becomes current once its heading has scrolled above the line.",
        controls: "Sets TableOfContentsProps.offsetRatio",
    };
}
