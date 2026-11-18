export const QUANTITY_MIN = 0;
export const QUANTITY_MAX = 100;
export const QUANTITY_STEP = 5;
export const RATING_MIN = 0;
export const RATING_MAX = 5;
export const RATING_STEP = 0.1;
export const FIELD_WIDTH = 180;
export const GERMAN_LOCALE = "de-DE";
export const AMOUNT_STEP = 0.5;

export const EXAMPLE_NAMES = {
    default: "Default",
    steppedClamped: "Stepped and clamped",
    fractionalStep: "Fractional step",
    german: "German conventions",
    unit: "With a unit",
    readOnly: "Read-only",
    disabled: "Disabled",
    reachable: "Disabled + reachable",
    errored: "Error",
    label: "In a Label",
};

export const EXAMPLES_ROOT = "/src/App/Pages/NumberInputPage/Examples";

export const DOCS_ROOT = "/src/App/Pages/NumberInputPage/Docs";

export const NUMBER_LOCALES = ["en-US", GERMAN_LOCALE, "fr-FR", "hi-IN"];

export const DOCS_SECTIONS = {
    rightLeft: {
        title: "Right to left",
        content:
            "Inside a box whose text runs right to left, the number starts from the right and the trailing slot, here the unit and the stepper, sits on the left, taking the narrow side of the [prop]padding[/prop] with it. The up and down arrow keys keep their meaning.",
    },
    steppingLimits: {
        title: "Stepping and limits",
        content:
            "Its value is a number, or undefined while the field is empty. The up and down arrow keys and the stepper buttons move it by [prop]step[/prop], repeating while held, and a fractional step lands on clean values rather than drifting. A [prop]min[/prop] and a [prop]max[/prop] keep it in range: a typed value outside them is corrected once the field is left, never while it is being typed.",
    },
    numbersWrittenLocalWay: {
        title: "Numbers written the local way",
        content:
            "Give it a [prop]locale[/prop] and it reads and writes numbers the way that locale does: in German, a comma before the decimals and dots between the thousands. Left out, it follows the reader's own.",
    },
    unitBesideStepper: {
        title: "A unit beside the stepper",
        content:
            "The trailing slot is handed the stepper and can draw more next to it, such as the unit the number is in.",
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

export const DISABLED_BUT_REACHABLE_AMOUNT_LABEL = "Disabled but reachable amount";
