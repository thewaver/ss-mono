import { DateValueUtils } from "@thewaver/ss-components";

export const EXAMPLE_NAMES = {
    default: "Default",
    bounded: "Bounded",
    twoMonths: "Two months",
    rightToLeft: "In a right-to-left box",
};

export const CALENDAR_IDS = DateValueUtils.getCalendarIds();

export const CALENDAR_FIELD_WIDTH = 180;

export const EXAMPLES_ROOT = "/src/App/Pages/RangeCalendarPage/Examples";

export const MONTH_HEADER_OPTIONS: Intl.DateTimeFormatOptions = { month: "long", year: "numeric" };

export const DOCS_ROOT = "/src/App/Pages/RangeCalendarPage/Docs";

export const DOCS_SECTIONS = {
    earliestLatestDay: {
        title: "Earliest and latest day",
        content:
            "A [prop]minValue[/prop] and a [prop]maxValue[/prop] keep both ends of the range between them: the days outside are disabled, and the arrow and page keys stop at the edge.",
    },
    twoMonths: {
        title: "Two months",
        content:
            "Set [prop]monthCount[/prop] to show several months side by side, so a range can start in one and end in the next. The arrow keys walk from one month into the other, the page keys step them all, and [prop]renderMonthHeader[/prop] draws the title over each.",
    },
    otherCalendarSystems: {
        title: "Other calendar systems",
        content:
            "The grid draws the month of whichever calendar the [prop]month[/prop] it is handed is in. Here the month is converted to the chosen calendar, and a range picked in one calendar covers the same days in any other.",
    },
    rightLeft: {
        title: "Right to left",
        content:
            "Inside a box whose text runs right to left, each week runs from the right, and the left arrow moves on to the next day, which is where it is drawn. Up, down and the page keys keep their meaning.",
    },
};

export const CHOOSE_DATE_RANGE_WITHIN_LABEL = "Choose a date range within the bounds";

export const CHOOSE_DATE_RANGE_RIGHT_LABEL = "Choose a date range in a right-to-left box";
