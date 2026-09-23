import type { Accessor, JSX } from "solid-js";

import type { TimeValue, TimeValueUnit } from "@thewaver/ss-utils";

import type { InteractionFlags } from "../../../Abstracts/InteractionTracker/InteractionTracker.types";
import type { InteractionControlProps } from "../../../Primitives/InteractionWrapper/InteractionWrapper.types";
import type { AccessorProps, SignalSource } from "../../../Utils/typeUtils";

export type ClockUnit = TimeValueUnit | "meridiem";

export type ClockSteps = Partial<Record<TimeValueUnit, number>>;

export type ClockOption = {
    unit: ClockUnit;
    time: TimeValue;
    label: string;
};

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

export type ClockOptionRenderer = (
    getOption: Accessor<ClockOption>,
    getRenderProps: () => InteractionFlags<ClockRenderProps>,
) => JSX.Element;

export type ClockUnitRenderer = (name: string, unit: ClockUnit) => JSX.Element;

export type ClockColumnRenderer = (renderOptions: () => JSX.Element, unit: ClockUnit) => JSX.Element;

export type ClockOptionProps = AccessorProps<
    Omit<InteractionControlProps<ClockRenderProps>, "renderContent"> & {
        /** Names the option for assistive technology, since the cell often shows only its number. Required here: a bare number is not a time. */
        ariaLabel: string;
        /** Draws the option. */
        renderContent: (getRenderProps: () => InteractionFlags<ClockRenderProps>) => JSX.Element;
        /** Runs when this option is picked. */
        onSelect: () => void;
    }
>;

export type ClockProps = AccessorProps<{
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
    /** Whether one time can be picked, for rules a plain earliest and latest cannot express. */
    computeIsTimeDisabled?: (time: TimeValue) => boolean;
    /** Which time is picked. It is the only thing that picks one. */
    valueSignal: SignalSource<TimeValue | undefined>;
    /** Draws one option. */
    renderOption: ClockOptionRenderer;
    /** Draws the heading for one unit's column. */
    renderUnit?: ClockUnitRenderer;
    /** Draws one unit's column. */
    renderColumn?: ClockColumnRenderer;
}>;
