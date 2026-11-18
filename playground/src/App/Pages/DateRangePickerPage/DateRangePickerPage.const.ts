export const EXAMPLE_NAMES = {
    picked: "Two fields, one value",
    bounded: "Bounded",
};

export const CALENDAR_FIELD_WIDTH = 180;

export const EXAMPLES_ROOT = "/src/App/Pages/DateRangePickerPage/Examples";

export const DOCS_ROOT = "/src/App/Pages/DateRangePickerPage/Docs";

export const DOCS_SECTIONS = {
    earliestLatestDate: {
        title: "Earliest and latest date",
        content:
            "A [prop]minValue[/prop] and a [prop]maxValue[/prop] keep both ends between them. The calendar disables the days outside, and a date typed outside them is moved to the nearest of the two once its field is left.",
    },
    otherCalendarSystems: {
        title: "Other calendar systems",
        content:
            "Set [prop]calendar[/prop] and both fields read and write their dates in that calendar system, and the calendar opens on that system's month. The value stays the same two days, as the line under the fields shows.",
    },
    rightLeft: {
        title: "Right to left",
        content:
            "Inside a box whose text runs right to left, the start field sits on the right, where reading starts, the end field and the calendar's trigger on the left, each field's text lines up on the right, and the calendar opens under the right edge of the pair.",
    },
    tooltip: {
        title: "Tooltip",
        content:
            "Give a picker [prop]tooltipDefs[/prop] and one tooltip shows over both fields while either is hovered or holds keyboard focus, read by screen readers as the description of whichever field is focused. A disabled picker shows no tooltip unless you also keep it reachable when disabled; its fields can then be focused to read why it is off, and typing still changes nothing.",
    },
};
