import { type DateValueCalendarId, DateValueUtils, type DateValueWeekStart } from "@thewaver/ss-components";

import { CalendarKnobs } from "../../Knobs/Calendars.const";

export const LOCALE = "en-GB";
export const WEEKEND_DAYS = [0, 6];

export const TODAY = DateValueUtils.fromIso("2026-08-10")!;
export const MIN_DATE = DateValueUtils.fromIso("2026-08-05")!;
export const MAX_DATE = DateValueUtils.fromIso("2026-08-20")!;
export const MIN_YEAR = DateValueUtils.fromIso("2019-01-01")!;
export const MAX_YEAR = DateValueUtils.fromIso("2031-12-31")!;

export const WEEK_START_LABELS: Record<DateValueWeekStart, string> = {
    0: "Sunday",
    1: "Monday",
    2: "Tuesday",
    3: "Wednesday",
    4: "Thursday",
    5: "Friday",
    6: "Saturday",
};

export const EXAMPLE_NAMES = {
    default: "Default",
    bounded: "Bounded",
    weekdays: "Weekdays only",
    weekNumbers: "Week numbers",
    rightToLeft: "In a right-to-left box",
    monthPicker: "Month picker",
    yearPicker: "Year picker",
};

export const CALENDAR_FIELD_WIDTH = 180;

export const EXAMPLES_ROOT = "/src/App/Pages/CalendarPage/Examples";

export const CALENDAR_IDS = DateValueUtils.getCalendarIds();

export const WEEK_STARTS: DateValueWeekStart[] = [...CalendarKnobs.WEEK_STARTS];

export const DOCS_ROOT = "/src/App/Pages/CalendarPage/Docs";

export const OTHER_CALENDAR: DateValueCalendarId = "hebrew";

export const DOCS_SECTIONS = {
    earliestLatestDay: {
        title: "Earliest and latest day",
        content:
            "A [prop]minValue[/prop] and a [prop]maxValue[/prop] keep the pick between them: the days outside are disabled, and the arrow and page keys stop at the edge.",
    },
    unpickableDays: {
        title: "Days that cannot be picked",
        content:
            "List the days to refuse in [prop]disabledDays[/prop]: a date, a span from one date to another, everything before or after a date, or days of the week, here Saturday and Sunday. A rule none of those can describe goes in [prop]computeIsDayDisabled[/prop], which is asked about every day shown, so keep it quick.",
    },
    weekNumbers: {
        title: "Week numbers",
        content:
            "Draw [prop]renderWeekNumber[/prop] and each week is headed by its number. Countries count weeks differently, so two settings decide it: [prop]weekStartsOn[/prop], the day a week begins, and [prop]minDaysInFirstWeek[/prop], how many days of the new year the first week must hold. Monday and 4 is ISO 8601, used across most of Europe; Sunday and 1 is the count used in the United States.",
    },
    pickingMonth: {
        title: "Picking a month",
        content:
            "Set [prop]precision[/prop] to month and the grid holds the year's months, three to a row. A pick sets the first day of that month, and the page keys step a year.",
    },
    pickingYear: {
        title: "Picking a year",
        content:
            "Set [prop]precision[/prop] to year and the grid holds twelve years, three to a row, and a pick sets the first day of that year. The limits still apply: here only the years from 2019 to 2031 can be picked.",
    },
    otherCalendarSystems: {
        title: "Other calendar systems",
        content:
            "A date carries its own calendar system, and the grid draws the month of whichever calendar the [prop]month[/prop] it is handed is in: its length, its name and its year. Here the month is converted to the chosen calendar, and the picked day stays the same day in any of them.",
    },
    rightLeft: {
        title: "Right to left",
        content:
            "Inside a box whose text runs right to left, each week runs from the right, and the right arrow moves to the day before, which is where it is drawn. Up, down and the page keys keep their meaning.",
    },
};

export const CHOOSE_DATE_WITHIN_AUGUST_LABEL = "Choose a date within August";

export const CHOOSE_WORKING_DAY_LABEL = "Choose a working day";

export const CHOOSE_DATE_RIGHT_LEFT_LABEL = "Choose a date in a right-to-left box";

export const PREVIOUS_TWELVE_YEARS_TEXT = "Previous twelve years";
