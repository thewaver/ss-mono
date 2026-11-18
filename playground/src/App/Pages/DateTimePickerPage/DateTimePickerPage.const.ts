export const EXAMPLE_NAMES = {
    paired: "Two fields, one value",
    picked: "One control, both popups",
    twelveHour: "Twelve hour, with seconds",
    seeded: "Starting from a value",
};

export const EXAMPLES_ROOT = "/src/App/Pages/DateTimePickerPage/Examples";

export const NOON = { hour: 12, minute: 0 };

export const DOCS_ROOT = "/src/App/Pages/DateTimePickerPage/Docs";

export const DOCS_SECTIONS = {
    twelveHoursSecond: {
        title: "Twelve hours, to the second",
        content:
            "Set [prop]isTwelveHour[/prop] and the time field and the clock read the hours from 1 to 12, with the field's morning or afternoon control drawn in [prop]renderTimeTrailing[/prop]. Set [prop]hasSeconds[/prop] and both take the seconds too. The value's time stays a 24-hour one.",
    },
    twoFieldsOfYourOwn: {
        title: "Two fields of your own",
        content:
            "The picker is built on a split you can use yourself: it takes the one value and hands back a date and a time, here for a plain DateInput and a TimeInput, and joins the two again on the way back. Clearing either field clears the value, and typing it again brings the other half back.",
    },
    rightLeft: {
        title: "Right to left",
        content:
            "Inside a box whose text runs right to left, the date field sits on the right, where reading starts, and the time field on the left, each field's trigger moves to its left end, and each popup opens under its own field's right edge.",
    },
    tooltip: {
        title: "Tooltip",
        content:
            "Give a picker [prop]tooltipDefs[/prop] and one tooltip shows over both fields while either is hovered or holds keyboard focus, read by screen readers as the description of whichever field is focused. A disabled picker shows no tooltip unless you also keep it reachable when disabled; its fields can then be focused to read why it is off, and typing still changes nothing.",
    },
};
