export const EXAMPLE_NAMES = {
    clocked: "With a clock",
    clockedTwelve: "Twelve hour, with a clock",
    booking: "Every fifteen minutes",
};

export const EXAMPLES_ROOT = "/src/App/Pages/TimePickerPage/Examples";

export const DOCS_ROOT = "/src/App/Pages/TimePickerPage/Docs";

export const DOCS_SECTIONS = {
    twelveHours: {
        title: "Twelve hours",
        content:
            "Set [prop]isTwelveHour[/prop] and both the field and the clock read the hours from 1 to 12, the clock with a column for morning and afternoon. The field's own marker is a control you draw in [prop]renderTrailing[/prop], which sits before the clock's trigger. The value underneath stays a 24-hour time, as the line under the field shows.",
    },
    everyFifteenMinutesWithin: {
        title: "Every fifteen minutes, within opening hours",
        content:
            "Set [prop]clockSteps[/prop] to offer fewer times in a column, here every fifteen minutes. A [prop]minValue[/prop] and a [prop]maxValue[/prop] keep the time in range: the clock offers nothing outside them, and a typed time outside them is moved to the nearest of the two once the field is left. Typing is not held to the steps.",
    },
    rightLeft: {
        title: "Right to left",
        content:
            "Inside a box whose text runs right to left, the trailing content and the clock's trigger move to the left, where reading ends, the text lines up on the right, and the clock opens under the field's right edge.",
    },
    tooltip: {
        title: "Tooltip",
        content:
            "Give a picker [prop]tooltipDefs[/prop] and its field shows a tooltip on hover and on keyboard focus, read by screen readers as the field's description. A disabled picker shows no tooltip unless you also keep it reachable when disabled; its field can then be focused to read why it is off, and typing still changes nothing.",
    },
    namedLabel: {
        title: "Named by a Label",
        content:
            "Inside a Label, the field takes its name from the label's text, so it needs no [prop]ariaLabel[/prop], and pressing the text focuses the field. The clock's trigger keeps the name [prop]triggerAriaLabel[/prop] gives it, since the label's text names the field.",
    },
};

export const TIME_RIGHT_LEFT_BOX_LABEL = "Time in a right-to-left box";
