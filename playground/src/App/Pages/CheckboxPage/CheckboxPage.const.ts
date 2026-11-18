export const EXAMPLE_NAMES = {
    default: "Default",
    decorated: "Decorated",
    mixed: "Mixed",
    refusedWrite: "Refused write",
    disabled: "Disabled",
    reachable: "Disabled + reachable",
    errored: "Error",
};

export const EXAMPLES_ROOT = "/src/App/Pages/CheckboxPage/Examples";

export const DOCS_ROOT = "/src/App/Pages/CheckboxPage/Docs";

export const DOCS_SECTIONS = {
    rightLeft: {
        title: "Right to left",
        content: "Inside a box whose text runs right to left, the box sits to the right of its words.",
    },
    mixed: {
        title: "Mixed",
        content:
            "A checkbox can be neither on nor off. Set [prop]isMixed[/prop] and it reads as mixed, to a screen reader as well as on screen, which is what a box summarizing others shows while they disagree. Pressing it sets a value, so here it turns both of the boxes it controls on or off.",
    },
    refusingChange: {
        title: "Refusing a change",
        content:
            "The checkbox reports a press through [prop]onChange[/prop] and shows whatever its value then holds, so a change can be refused by writing the old value back. Here at least one way to be reached must stay on: whichever box is the last one on refuses to go off.",
    },
    decoration: {
        title: "Decoration",
        content:
            "Anything drawn over the box goes through [prop]renderDecoration[/prop], which is handed the checkbox's state like the painter is: here a corner highlight shows while it is pressed.",
    },
    tooltip: {
        title: "Tooltip",
        content:
            "Give a checkbox [prop]tooltipDefs[/prop] and it shows a tooltip on hover and on keyboard focus, read by screen readers as the checkbox's description. A disabled checkbox shows no tooltip unless you also keep it reachable when disabled; it can then be focused to read why it is off, and pressing it still changes nothing.",
    },
};

export const CHECKBOX_TOOLTIP_LABEL = "Checkbox with a tooltip";
