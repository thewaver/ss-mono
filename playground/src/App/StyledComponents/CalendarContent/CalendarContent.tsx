import type { ParentProps } from "solid-js";

import { access } from "@thewaver/ss-components";

import type { CalendarDayProps, CalendarTitleProps } from "./CalendarContent.types";

import * as styles from "./CalendarContent.css";

export const PageCalendarDay = (props: CalendarDayProps) => {
    return (
        <div
            class={styles.calendarDay}
            classList={{
                [styles.isSelected]: access(props.flags).isSelected,
                [styles.isToday]: access(props.flags).isToday,
                [styles.isOutsideMonth]: access(props.flags).isOutsideMonth,
                [styles.isHovered]: access(props.flags).isHovered,
                [styles.isDisabled]: access(props.flags).isDisabled,
                [styles.isInRange]: access(props.flags).isInRange,
                [styles.isRangeStart]: access(props.flags).isRangeStart,
                [styles.isRangeEnd]: access(props.flags).isRangeEnd,
            }}
            data-in-range={access(props.flags).isInRange || undefined}
            data-range-start={access(props.flags).isRangeStart || undefined}
            data-range-end={access(props.flags).isRangeEnd || undefined}
            aria-hidden="true"
        >
            {access(props.flags).day.day}
        </div>
    );
};

export const PageCalendarWeekday = (props: ParentProps) => (
    <div class={styles.calendarWeekday} aria-hidden="true">
        {props.children}
    </div>
);

export const PageCalendarTitle = (props: ParentProps<CalendarTitleProps>) => {
    return (
        <div
            class={styles.calendarTitle}
            classList={{ [styles.isHovered]: access(props.flags).isHovered }}
            aria-hidden="true"
        >
            {props.children}
        </div>
    );
};

export const PageCalendarHeader = (props: ParentProps) => <div class={styles.calendarHeader}>{props.children}</div>;

export const PageCalendarFrame = (props: ParentProps) => <div class={styles.calendarFrame}>{props.children}</div>;
