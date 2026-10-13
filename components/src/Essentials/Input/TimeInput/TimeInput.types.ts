import type { TimeValue, TimeValueMeridiem, TimeValueUnit } from "@thewaver/ss-utils";

export type TimeInputMeridiem = {
    getValue: () => TimeValueMeridiem;
    set: (meridiem: TimeValueMeridiem) => void;
    toggle: () => void;
};

export type BaseTimeInputValues = {
    /** The earliest time that can be entered. */
    minValue?: TimeValue;
    /** The latest time that can be entered. */
    maxValue?: TimeValue;
    /** Whether seconds are part of the value as well as hours and minutes. */
    hasSeconds?: boolean;
    /** Whether times are written as twelve hours with a morning and afternoon marker, or as twenty-four. */
    isTwelveHour?: boolean;
    /**
     * The letters that stand for each part of the time in the format hint handed to `renderPlaceholder`. The
     * field joins them with a colon, and leaves out seconds when the time has none.
     */
    segmentHints: Record<TimeValueUnit, string>;
};

export type BaseTimeInputProps = BaseTimeInputValues;
