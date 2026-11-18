export const EXAMPLE_NAMES = {
    default: "Default",
    stepped: "Stepped",
    pair: "Pair",
    rightToLeft: "Pair in a right-to-left box",
    priceRange: "Price range, read as prices",
    vertical: "Vertical",
    knob: "Knob",
    disabled: "Disabled",
    disabledPair: "Disabled pair",
    reachable: "Disabled + reachable",
    errored: "Error",
};

export const STEP_COUNT = 5;

export const EXAMPLES_ROOT = "/src/App/Pages/RangePage/Examples";

export const DOCS_ROOT = "/src/App/Pages/RangePage/Docs";

export const DIFFICULTY_MIN = 1;
export const DIFFICULTY_MAX = 5;
export const DIFFICULTY_STEP = 1;

export const DOCS_SECTIONS = {
    steppingLimits: {
        title: "Stepping and limits",
        content:
            "A thumb sits between [prop]min[/prop] and [prop]max[/prop] and moves in steps of [prop]step[/prop], counted from the minimum. The arrow keys move it one step, Home and End take it to either end, and a drag lands on the same steps.",
    },
    twoThumbs: {
        title: "Two thumbs",
        content:
            "Hand it [prop]range[/prop], a start and an end, in place of [prop]value[/prop], and it draws two thumbs over one track. Each thumb is a slider of its own, named by its entry in [prop]thumbLabels[/prop] and with its own stop for the Tab key, and neither can pass the other. Turned off, both thumbs leave the tab order.",
    },
    rightLeft: {
        title: "Right to left",
        content:
            "Inside a box whose text runs right to left, the track runs from the right: the lowest value is at the right end, so the thumb for the start of the range sits to the right of the one for its end, and the left arrow key raises a thumb's value rather than lowering it.",
    },
    readPrices: {
        title: "Read as prices",
        content:
            "A screen reader reads a thumb's bare number unless you pass [prop]computeValueText[/prop], which turns a value into the words to read instead, here a price. It is handed the value and which thumb holds it. Separately, [prop]onChangeEnd[/prop] runs once a change is finished, when a drag lets go or after each key press, for work that should not run on every step of a drag.",
    },
    tooltip: {
        title: "Tooltip",
        content:
            "Give a range [prop]tooltipDefs[/prop] and it shows a tooltip on hover and on keyboard focus, read by screen readers as the range's description. A disabled range shows no tooltip unless you also keep it reachable when disabled; it can then be focused to read why it is off, and neither the arrow keys nor a drag move it.",
    },
};

export const DISABLED_BUT_REACHABLE_RANGE_LABEL = "Disabled but reachable range";
