export const EXAMPLE_NAMES = {
    checkbox: "Checkbox",
    toggleCaptionFirst: "Toggle, caption first",
    column: "Column",
    labelPerRadio: "One label per radio",
    suppressed: "Suppressed aria-label",
    disabled: "Disabled",
};

export const EXAMPLES_ROOT = "/src/App/Pages/LabelPage/Examples";

export const DOCS_ROOT = "/src/App/Pages/LabelPage/Docs";

export const DOCS_SECTIONS = {
    rightLeft: {
        title: "Right to left",
        content:
            "Inside a box whose text runs right to left, the label lays its children out from the right, so the checkbox, written first, sits to the right of its caption.",
    },
    captionFirst: {
        title: "The caption first",
        content:
            "The caption and the control sit in the order they are written, so a caption written first comes before the control, as is usual beside a switch. Pressing the caption still flips it.",
    },
    oneLabelPerRadio: {
        title: "One label per radio",
        content:
            "A label names one control, so in a radio group each radio gets a label of its own. The group as a whole is named through its own [prop]ariaLabel[/prop], since a caption wrapped round the whole group would name only the first radio, and pressing it would pick that one.",
    },
};

export const ANNOUNCED_SOMETHING_ELSE_LABEL = "Announced as something else";
