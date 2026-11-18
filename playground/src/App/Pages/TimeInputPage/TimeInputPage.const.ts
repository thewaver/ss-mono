export const EXAMPLE_NAMES = {
    time: "A time, typed or stepped",
    twelve: "Twelve hour",
    precise: "To the second",
    shift: "Within opening hours",
};

export const EXAMPLES_ROOT = "/src/App/Pages/TimeInputPage/Examples";

export const DOCS_ROOT = "/src/App/Pages/TimeInputPage/Docs";

export const DOCS_SECTIONS = {
    twelveHours: {
        title: "Twelve hours",
        content:
            "Set [prop]isTwelveHour[/prop] and the hours are written from 1 to 12, with the morning or afternoon decided by a control you draw in [prop]renderTrailing[/prop], which is handed the field's reading of it and a way to switch it. The value underneath stays a 24-hour time, as the line under the field shows.",
    },
    second: {
        title: "To the second",
        content:
            "Set [prop]hasSeconds[/prop] and the field takes a third part, the seconds, which the arrow keys step like the others. Without it the value is a time to the minute.",
    },
    withinOpeningHours: {
        title: "Within opening hours",
        content:
            "A [prop]minValue[/prop] and a [prop]maxValue[/prop] keep the time in range. The arrow keys stop at them, and a typed time outside them is kept as typed until the field is left, then moved to the nearest of the two.",
    },
    rightLeft: {
        title: "Right to left",
        content:
            "Inside a box whose text runs right to left, the trailing content moves to the left, where reading ends, and the text lines up on the right. The time itself is still written hours first, since digits run left to right in either direction.",
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

export const TIME_RIGHT_LEFT_BOX_LABEL = "Time in a right-to-left box";
