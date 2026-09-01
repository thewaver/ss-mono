import type { ParentProps } from "solid-js";

import { access } from "@thewaver/ss-components";

import type { CalendarDayProps, CalendarTitleProps } from "./CalendarContent.types";

import * as styles from "./CalendarContent.css";

export const PageCalendarDay = (props: CalendarDayProps) => {
    return (
        <div
            class={styles.calendarDay}
            classList={{
                [styles.isSelected]: access(props.renderProps).isSelected,
                [styles.isToday]: access(props.renderProps).isToday,
                [styles.isOutsideMonth]: access(props.renderProps).isOutsideMonth,
                [styles.isHovered]: access(props.renderProps).isHovered,
                [styles.isDisabled]: access(props.renderProps).isDisabled,
                [styles.isInRange]: access(props.renderProps).isInRange,
                [styles.isRangeStart]: access(props.renderProps).isRangeStart,
                [styles.isRangeEnd]: access(props.renderProps).isRangeEnd,
            }}
            data-in-range={access(props.renderProps).isInRange || undefined}
            data-range-start={access(props.renderProps).isRangeStart || undefined}
            data-range-end={access(props.renderProps).isRangeEnd || undefined}
            aria-hidden="true"
        >
            {access(props.renderProps).day.day}
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
