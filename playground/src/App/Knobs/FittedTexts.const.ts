export namespace FittedTextKnobs {
    export const MIN_LINE_HEIGHT_RATIO = 0.8;
    export const MAX_LINE_HEIGHT_RATIO = 2;
    export const LINE_HEIGHT_RATIO_STEP = 0.05;

    export const LINE_HEIGHT_RATIO_TEXT = {
        label: "Line height",
        hint: "Each line's height as a multiple of its own font size, which is the room the stack is fitted with.",
        controls: "Sets FittedTextProps.lineHeightRatio",
    };
}
