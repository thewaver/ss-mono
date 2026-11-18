export const FIELD_WIDTH = 300;
export const FIXED_HEIGHT = 110;
export const MIN_ROWS = 2;
export const MAX_ROWS = 8;
export const REVIEW_LIMIT = 80;
export const LONG_TEXT = "One line.\nTwo lines.\nThree lines, and the box has to have grown by now.";

export const EXAMPLE_NAMES = {
    fixedHeight: "Fixed height",
    autoSizing: "Auto-sizing",
    autoSizingCapped: "Auto-sizing, capped",
    readOnly: "Read-only",
    disabled: "Disabled",
    reachable: "Disabled + reachable",
    errored: "Error",
    label: "In a Label",
};

export const EXAMPLES_ROOT = "/src/App/Pages/TextAreaPage/Examples";

export const DOCS_ROOT = "/src/App/Pages/TextAreaPage/Docs";

export const DOCS_SECTIONS = {
    rightLeft: {
        title: "Right to left",
        content:
            "Inside a box whose text runs right to left, every line starts from the right of the box, and so does the placeholder. The sides of [prop]padding[/prop] are where the text starts and ends rather than the screen's left and right.",
    },
    growingWithTyping: {
        title: "Growing with what is typed",
        content:
            "With [prop]isAutoSizing[/prop] on, the box follows its own content: it starts [prop]minRows[/prop] tall and grows a row at a time as lines are added, so nothing has to guess a height. At [prop]maxRows[/prop] it stops growing and scrolls instead.",
    },
    tooltip: {
        title: "Tooltip",
        content:
            "Give a field [prop]tooltipDefs[/prop] and it shows a tooltip on hover and on keyboard focus, read by screen readers as the field's description. A disabled field shows no tooltip unless you also keep it reachable when disabled; it can then be focused to read why it is off, and typing still changes nothing.",
    },
    namedLabel: {
        title: "Named by a Label",
        content:
            "Inside a Label, the field takes its name from the label's text, so it needs no [prop]ariaLabel[/prop], and pressing the text focuses the field.",
    },
};

export const NOTES_TOOLTIP_LABEL = "Notes with a tooltip";
