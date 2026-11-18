import { type ClockSteps, DateValueUtils } from "@thewaver/ss-components";
import type { TimeValue } from "@thewaver/ss-utils";

export const FIELD_WIDTH = 220;
export const PAIR_FIELD_WIDTH = 160;
export const LOCALE = "en-GB";

export const TODAY = DateValueUtils.fromIso("2026-08-10")!;
export const MIN_DATE = DateValueUtils.fromIso("2026-08-05")!;
export const MAX_DATE = DateValueUtils.fromIso("2026-08-20")!;
export const CAESAR = DateValueUtils.fromIso("-000043-03-15")!;

export const OPENING_TIME: TimeValue = { hour: 9, minute: 0 };
export const CLOSING_TIME: TimeValue = { hour: 17, minute: 30 };

export const BOOKING_STEPS: ClockSteps = { minute: 15 };

export const EXAMPLE_NAMES = {
    picked: "With a calendar",
    bounded: "Bounded",
    weekdays: "Weekdays only",
    monthPrecision: "Picking a month",
};

export const CALENDAR_FIELD_WIDTH = 180;

export const CALENDAR_IDS = DateValueUtils.getCalendarIds();

export const WEEK_STARTS_ON_MONDAY = 1;

export const WEEKEND_OFFSET = 5;

export const EXAMPLES_ROOT = "/src/App/Pages/DatePickerPage/Examples";

export const DOCS_ROOT = "/src/App/Pages/DatePickerPage/Docs";

export const DOCS_SECTIONS = {
    earliestLatestDate: {
        title: "Earliest and latest date",
        content:
            "A [prop]minValue[/prop] and a [prop]maxValue[/prop] keep the date between them. The calendar disables the days outside, and a typed date outside them is kept as typed until the field is left, then moved to the nearest of the two.",
    },
    unpickableDays: {
        title: "Days that cannot be picked",
        content:
            "Describe the days that cannot be picked in [prop]disabledDays[/prop], here Saturday and Sunday, or give a rule of your own in [prop]computeIsDayDisabled[/prop]. The field and the calendar refuse the same days: the calendar disables them, and a refused day typed into the field is kept as typed and marked as an error while the value stays where it was, as the line under the field shows.",
    },
    pickingMonth: {
        title: "Picking a month",
        content:
            "Set [prop]precision[/prop] to month and the calendar holds the year's months instead of a month's days, and a pick there sets the first day of the month. The field still takes a whole date.",
    },
    otherCalendarSystems: {
        title: "Other calendar systems",
        content:
            "Set [prop]calendar[/prop] and the field reads and writes the date in that calendar system, and the calendar opens on that system's month. The value stays the same day, as the line under the field shows.",
    },
    rightLeft: {
        title: "Right to left",
        content:
            "Inside a box whose text runs right to left, the leading content moves to the right, where reading starts, and the calendar's trigger to the left, and the calendar opens under the field's right edge. The date is still written year first, since digits run left to right in either direction.",
    },
    tooltip: {
        title: "Tooltip",
        content:
            "Give a picker [prop]tooltipDefs[/prop] and its field shows a tooltip on hover and on keyboard focus, read by screen readers as the field's description. A disabled picker shows no tooltip unless you also keep it reachable when disabled; its field can then be focused to read why it is off, and typing still changes nothing.",
    },
    namedLabel: {
        title: "Named by a Label",
        content:
            "Inside a Label, the field takes its name from the label's text, so it needs no [prop]ariaLabel[/prop], and pressing the text focuses the field. The calendar's trigger keeps the name [prop]triggerAriaLabel[/prop] gives it, since the label's text names the field.",
    },
};

export const DATE_RIGHT_LEFT_BOX_LABEL = "Date in a right-to-left box";
