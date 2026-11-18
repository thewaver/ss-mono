export namespace StepperKnobs {
    export const FREE_NAVIGATION_TEXT = {
        label: "Free navigation",
        hint: "Lets any step be pressed to jump to it, rather than only the steps already behind you.",
        controls: "Sets Step.isNavigable on every step sent to StepperProps.steps",
    };

    export const ORIENTATION_TEXT = {
        label: "Orientation",
        hint: "Whether the steps run across the page or down it.",
        controls: "Sets StepperProps.orientation",
    };
}
