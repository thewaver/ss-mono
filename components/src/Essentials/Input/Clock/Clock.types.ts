import type { TimeValue, TimeValueUnit } from "@thewaver/ss-utils";

export type ClockUnit = TimeValueUnit | "meridiem";

export type ClockSteps = Partial<Record<TimeValueUnit, number>>;

export type ClockOption = {
    unit: ClockUnit;
    time: TimeValue;
    label: string;
};

export type ClockColumn = {
    unit: ClockUnit;
    readings: number[];
    options: ClockOption[];
};

export type ClockKeyAction =
    | { kind: "pick"; time: TimeValue; unit: ClockUnit }
    | { kind: "highlight"; time: TimeValue }
    | { kind: "unit"; unit: ClockUnit };

export type ClockRenderProps = {
    /** The time this option stands for. */
    option: ClockOption;
    /** Whether this option is the picked one. */
    isSelected: boolean;
    /** Whether this option is the current time. */
    isNow: boolean;
    /** Whether the keyboard is currently on this option. */
    isHighlighted: boolean;
};

export type BaseClockValues = {
    /** Names the clock for assistive technology. */
    ariaLabel?: string;
    /** Which country's conventions the times are written in. */
    locale?: string;
    /** What counts as now, so a consumer can hold it still rather than letting it follow the clock. */
    now?: TimeValue;
    /** The earliest time that can be picked. */
    minValue?: TimeValue;
    /** The latest time that can be picked. */
    maxValue?: TimeValue;
    /** How far apart the offered times are, per unit. */
    steps?: ClockSteps;
    /** Whether seconds are offered as well as hours and minutes. */
    hasSeconds?: boolean;
    /** Whether times are written as twelve hours with a morning and afternoon marker, or as twenty-four. */
    isTwelveHour?: boolean;
    /** Turns the clock off, so no time can be picked. */
    isDisabled?: boolean;
    /** The space between columns. */
    gap?: number;
};

export type BaseClockCbs = {
    /** Whether one time can be picked, for rules a plain earliest and latest cannot express. */
    computeIsTimeDisabled?: (time: TimeValue) => boolean;
};

export type BaseClockProps = BaseClockValues & BaseClockCbs;
