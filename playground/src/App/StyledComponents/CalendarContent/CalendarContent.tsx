import type { ParentProps } from "solid-js";

import { access } from "@thewaver/ss-components";

import { useLayerClass } from "../Layer/Layer.context";
import type { CalendarCaptionFieldsProps, CalendarDayProps, CalendarTitleProps } from "./CalendarContent.types";

import * as styles from "./CalendarContent.css";

export const PageCalendarDay = (props: CalendarDayProps) => {
    const getLayerClass = useLayerClass();

    return (
        <div
            class={styles.calendarDay}
            classList={{
                [getLayerClass()]: true,
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

export const PageCalendarCell = (props: ParentProps<CalendarDayProps>) => {
    const getLayerClass = useLayerClass();

    return (
        <div
            class={[styles.calendarDay, styles.isWide].join(" ")}
            classList={{
                [getLayerClass()]: true,
                [styles.isSelected]: access(props.renderProps).isSelected,
                [styles.isToday]: access(props.renderProps).isToday,
                [styles.isHovered]: access(props.renderProps).isHovered,
                [styles.isDisabled]: access(props.renderProps).isDisabled,
            }}
            aria-hidden="true"
        >
            {props.children}
        </div>
    );
};

export const PageCalendarWeekday = (props: ParentProps) => {
    const getLayerClass = useLayerClass();

    return (
        <div class={[styles.calendarWeekday, getLayerClass()].join(" ")} aria-hidden="true">
            {props.children}
        </div>
    );
};

export const PageCalendarTitle = (props: ParentProps<CalendarTitleProps>) => {
    const getLayerClass = useLayerClass();

    return (
        <div
            class={styles.calendarTitle}
            classList={{ [getLayerClass()]: true, [styles.isHovered]: access(props.flags).isHovered }}
            aria-hidden="true"
        >
            {props.children}
        </div>
    );
};

export const PageCalendarHeader = (props: ParentProps) => {
    const getLayerClass = useLayerClass();

    return <div class={[styles.calendarHeader, getLayerClass()].join(" ")}>{props.children}</div>;
};

export const PageCalendarFrame = (props: ParentProps) => {
    const getLayerClass = useLayerClass();

    return <div class={[styles.calendarFrame, getLayerClass()].join(" ")}>{props.children}</div>;
};

export const PageCalendarCaptionFields = (props: CalendarCaptionFieldsProps) => {
    const getLayerClass = useLayerClass();

    return <div {...props} class={[styles.calendarCaptionFields, getLayerClass()].join(" ")} />;
};
