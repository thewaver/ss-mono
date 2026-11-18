export const ONE_TIME_CODE_LENGTH = 6;
export const RECOVERY_CODE_LENGTH = 8;

export const EXAMPLE_NAMES = {
    oneTimeCode: "One-time code",
    recoveryCode: "Letters and digits",
};

export const EXAMPLES_ROOT = "/src/App/Pages/SegmentedInputPage/Examples";

export const DOCS_ROOT = "/src/App/Pages/SegmentedInputPage/Docs";

export const DOCS_SECTIONS = {
    lettersWellDigits: {
        title: "Letters as well as digits",
        content:
            "Which characters the field takes is answered one at a time by [prop]computeIsAllowed[/prop], and a refused character is dropped wherever it appears, in a paste as much as in typing. Here letters and digits are allowed, and [prop]inputMode[/prop] is set to text so that a phone offers its whole keyboard rather than digits alone.",
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

export const ONE_TIME_CODE_RIGHT_LABEL = "One-time code in a right-to-left box";

export const DISABLED_BUT_REACHABLE_CODE_LABEL = "Disabled but reachable code";
