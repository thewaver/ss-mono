import { style } from "@vanilla-extract/css";

export const DAYS_PER_WEEK = 7;

export const calendarRoot = style({
    display: "grid",
    gridTemplateColumns: `repeat(${DAYS_PER_WEEK}, 1fr)`,
    width: "fit-content",
});

export const calendarRow = style({
    display: "grid",
    gridColumn: `span ${DAYS_PER_WEEK}`,
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
