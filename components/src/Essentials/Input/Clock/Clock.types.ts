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
