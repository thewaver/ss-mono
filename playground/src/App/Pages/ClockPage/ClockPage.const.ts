export const EXAMPLE_NAMES = {
    default: "One column per unit",
    twelve: "Twelve hour",
    bounded: "Coarser, and bounded",
    rightToLeft: "In a right-to-left box",
};

export const EXAMPLES_ROOT = "/src/App/Pages/ClockPage/Examples";

export const DOCS_ROOT = "/src/App/Pages/ClockPage/Docs";

export const DOCS_SECTIONS = {
    twelveHours: {
        title: "Twelve hours",
        content:
            "Set [prop]isTwelveHour[/prop] and the hour column reads from 12 through 11, starting at midnight, and a column of its own picks the morning or the afternoon. The value underneath stays a 24-hour time, as the line under the clock shows.",
    },
    everyFifteenMinutesWithin: {
        title: "Every fifteen minutes, within opening hours",
        content:
            "Set [prop]steps[/prop] to offer fewer times in a column, here every fifteen minutes. A [prop]minValue[/prop] and a [prop]maxValue[/prop] keep the time in range: an option is disabled when the time it would pick falls outside them, so with the shop shutting at 17:30, the hour 17 is off whenever the minutes read 45.",
    },
    rightLeft: {
        title: "Right to left",
        content:
            "Inside a box whose text runs right to left, the columns run from the right, so the hours sit on the right, and the left arrow moves on to the next column.",
    },
};

export const TIME_RIGHT_LEFT_BOX_LABEL = "Time in a right-to-left box";
