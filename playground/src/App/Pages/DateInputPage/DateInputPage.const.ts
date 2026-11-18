import { DateValueUtils } from "@thewaver/ss-components";

export const EXAMPLE_NAMES = {
    typed: "Typed only",
    locale: "Day first",
    era: "Before the common era",
};

export const CALENDAR_FIELD_WIDTH = 180;

export const FORMAT_FIELD_WIDTH = 180;

export const CALENDAR_IDS = DateValueUtils.getCalendarIds();

export const EXAMPLES_ROOT = "/src/App/Pages/DateInputPage/Examples";

export const DOCS_ROOT = "/src/App/Pages/DateInputPage/Docs";

export const DOCS_SECTIONS = {
    writtenDayFirst: {
        title: "Written day first",
        content:
            "The parts of the date are typed in the order [prop]format[/prop] names: year first by default, or day first, or month first. Only digits are typed, and the field adds each separator as soon as the part before it is complete. The value is the same date in any order, as the line under the field shows.",
    },
    beforeCommonEra: {
        title: "Before the common era",
        content:
            "A date carries its era, and the digits typed cannot say which one it is. Draw a control in [prop]renderLeading[/prop], which is handed the date's era, the eras its calendar offers and a way to change it, and this date of 44 BC can be moved to AD and back.",
    },
    otherCalendarSystems: {
        title: "Other calendar systems",
        content:
            "Set [prop]calendar[/prop] and the date is read and written in that calendar system while the value stays the same day, as the line under the field shows. A calendar with one era, such as the Hebrew one, gives the era control nothing to offer, so it is not drawn.",
    },
    rightLeft: {
        title: "Right to left",
        content:
            "Inside a box whose text runs right to left, the leading content moves to the right, where reading starts, and the text lines up on the right. The date is still written year first, since digits run left to right in either direction.",
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

export const DATE_RIGHT_LEFT_BOX_LABEL = "Date in a right-to-left box";
