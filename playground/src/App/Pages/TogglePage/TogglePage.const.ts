export const EXAMPLE_NAMES = {
    default: "Default",
    decorated: "Decorated",
    mixed: "Mixed",
    disabled: "Disabled",
    reachable: "Disabled + reachable",
    errored: "Error",
};

export const EXAMPLES_ROOT = "/src/App/Pages/TogglePage/Examples";

export const DOCS_ROOT = "/src/App/Pages/TogglePage/Docs";

export const DOCS_SECTIONS = {
    rightLeft: {
        title: "Right to left",
        content:
            "Inside a box whose text runs right to left, the track sits to the right of its words, and switching the toggle on slides the handle to the left, the end the text runs toward.",
    },
    mixed: {
        title: "Mixed",
        content:
            "A toggle summarizing others can be neither on nor off: set [prop]isMixed[/prop] while they disagree. A switch has no way to say mixed to a screen reader, so while mixed the toggle reads as a mixed checkbox instead, and as a switch again once it is on or off. Pressing it sets a value, so here it turns both of the toggles it controls on or off.",
    },
    decoration: {
        title: "Decoration",
        content:
            "Anything drawn over the toggle goes through [prop]renderDecoration[/prop], which is handed the toggle's state like the painter is: here a corner highlight shows while it is pressed.",
    },
    tooltip: {
        title: "Tooltip",
        content:
            "Give a toggle [prop]tooltipDefs[/prop] and it shows a tooltip on hover and on keyboard focus, read by screen readers as the toggle's description. A disabled toggle shows no tooltip unless you also keep it reachable when disabled; it can then be focused to read why it is off, and pressing it still changes nothing.",
    },
};

export const TOGGLE_TOOLTIP_LABEL = "Toggle with a tooltip";
