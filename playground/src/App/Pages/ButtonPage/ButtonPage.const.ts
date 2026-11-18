export const EXAMPLE_NAMES = {
    decorated: "Decorated",
    counter: "Hold to repeat",
    pending: "Pending",
    copy: "Copy to the clipboard",
};

export const COPY_TEXT = "npm install @thewaver/ss-components";

export const EXAMPLES_ROOT = "/src/App/Pages/ButtonPage/Examples";

export const DOCS_ROOT = "/src/App/Pages/ButtonPage/Docs";

export const DOCS_SECTIONS = {
    tooltip: {
        title: "Tooltip",
        content:
            "Give a button [prop]tooltipDefs[/prop] and it shows a tooltip on hover and on keyboard focus, and links it to the button so screen readers read it as the button's description. A disabled button shows no tooltip unless you also keep it reachable when disabled; then it can still tell people why it is off.",
    },
    decoration: {
        title: "Decoration",
        content:
            "Anything drawn over the button goes through [prop]renderDecoration[/prop], which is handed the button's state like the painter is. Here a corner highlight shows while the button is pressed, and a ripple spreads from where it was pressed, which [prop]onActivation[/prop] reports.",
    },
    holdRepeat: {
        title: "Hold to repeat",
        content:
            "A button reports the pointer going down and up through [prop]onPointerDown[/prop] and [prop]onPointerUp[/prop], which is enough to repeat an action while it is held: here a step happens at once, then again and again after a short wait until the pointer lifts or leaves. A press from the keyboard still steps once, through [prop]onClick[/prop].",
    },
};
