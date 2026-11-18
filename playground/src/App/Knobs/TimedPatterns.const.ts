export namespace TimedPatternKnobs {
    export const CONFIG_KEY_TEXT = {
        label: "Pattern",
        hint: "Which repeating pattern is shown.",
        controls: "Picks the sample pattern the example sends to ShapeProps.computeFillDefs",
    };

    export const ANIMATION_DURATION_MS_TEXT = {
        label: "Animation duration (ms)",
        hint: "How long one pass of the pattern's animation takes.",
        controls: "Sets SVGAnimationDefs.animationDurationMs",
    };

    export const ITERATION_CONFIG_KEY_TEXT = {
        label: "Iteration Pattern",
        hint: "How the animation repeats: once, endlessly, or back and forth.",
        controls: "Picks the sample iteration that fills SVGAnimationDefs.animationIterationPatterns",
    };
}
