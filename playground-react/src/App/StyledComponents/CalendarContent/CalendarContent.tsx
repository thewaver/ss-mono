import type { PropsWithChildren } from "react";

import * as styles from "@thewaver/ss-playground/App/StyledComponents/CalendarContent/CalendarContent.css";

import { useLayerClass } from "../Layer/Layer.context";
import type { CalendarCaptionFieldsProps, CalendarDayProps, CalendarTitleProps } from "./CalendarContent.types";

export const PageCalendarDay = (props: CalendarDayProps) => {
    const layerClass = useLayerClass();

    return (
        <div
            className={[
                styles.calendarDay,
                layerClass,
                props.renderProps.isSelected && styles.isSelected,
                props.renderProps.isToday && styles.isToday,
                props.renderProps.isOutsideMonth && styles.isOutsideMonth,
                props.renderProps.isHovered && styles.isHovered,
                props.renderProps.isDisabled && styles.isDisabled,
                props.renderProps.isInRange && styles.isInRange,
                props.renderProps.isRangeStart && styles.isRangeStart,
                props.renderProps.isRangeEnd && styles.isRangeEnd,
            ]
                .filter(Boolean)
                .join(" ")}
            data-in-range={props.renderProps.isInRange || undefined}
            data-range-start={props.renderProps.isRangeStart || undefined}
            data-range-end={props.renderProps.isRangeEnd || undefined}
            aria-hidden="true"
        >
            {props.renderProps.day.day}
        </div>
    );
};

export const PageCalendarCell = (props: PropsWithChildren<CalendarDayProps>) => {
    const layerClass = useLayerClass();

    return (
        <div
            className={[
                styles.calendarDay,
                styles.isWide,
                layerClass,
                props.renderProps.isSelected && styles.isSelected,
                props.renderProps.isToday && styles.isToday,
                props.renderProps.isHovered && styles.isHovered,
                props.renderProps.isDisabled && styles.isDisabled,
            ]
                .filter(Boolean)
                .join(" ")}
            aria-hidden="true"
        >
            {props.children}
        </div>
    );
};

export const PageCalendarWeekday = (props: PropsWithChildren) => {
    const layerClass = useLayerClass();

    return (
        <div className={[styles.calendarWeekday, layerClass].join(" ")} aria-hidden="true">
            {props.children}
        </div>
    );
};

export const PageCalendarTitle = (props: PropsWithChildren<CalendarTitleProps>) => {
    const layerClass = useLayerClass();

    return (
        <div
            className={[styles.calendarTitle, layerClass, props.flags.isHovered && styles.isHovered]
                .filter(Boolean)
                .join(" ")}
            aria-hidden="true"
        >
            {props.children}
        </div>
    );
};

export const PageCalendarHeader = (props: PropsWithChildren) => {
    const layerClass = useLayerClass();

    return <div className={[styles.calendarHeader, layerClass].join(" ")}>{props.children}</div>;
};

export const PageCalendarFrame = (props: PropsWithChildren) => {
    const layerClass = useLayerClass();

    return <div className={[styles.calendarFrame, layerClass].join(" ")}>{props.children}</div>;
};

export const PageCalendarCaptionFields = (props: CalendarCaptionFieldsProps) => {
    const layerClass = useLayerClass();

    return <div {...props} className={[styles.calendarCaptionFields, layerClass].join(" ")} />;
};
