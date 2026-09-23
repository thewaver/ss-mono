import { style } from "@vanilla-extract/css";

export const calendarRoot = style({
    display: "grid",
    width: "fit-content",
});

export const calendarRow = style({
    display: "grid",
    gridTemplateColumns: "subgrid",
});

export const calendarWeekday = style({
    display: "flex",
});

export const calendarDay = style({
    display: "flex",
    pointerEvents: "all",
    width: "100%",

    selectors: {
        "&:focus-visible": {
            zIndex: 1,
        },
    },
});
