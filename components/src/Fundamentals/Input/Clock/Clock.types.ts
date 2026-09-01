import type { Accessor, JSX } from "solid-js";

import type { TimeValue, TimeValueUnit } from "@thewaver/ss-utils";

import type { InteractionFlags } from "../../../Abstracts/InteractionTracker/InteractionTracker.types";
import type { AccessorProps, SignalSource } from "../../../Utils/typeUtils";
import type { InteractionControlProps } from "../../InteractionWrapper/InteractionWrapper.types";

export type ClockUnit = TimeValueUnit | "meridiem";

export type ClockSteps = Partial<Record<TimeValueUnit, number>>;

export type ClockOption = {
    unit: ClockUnit;
    time: TimeValue;
    label: string;
};

export type ClockRenderProps = {
    option: ClockOption;
    isSelected: boolean;
    isNow: boolean;
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
        ariaLabel: string;
        renderContent: (getRenderProps: () => InteractionFlags<ClockRenderProps>) => JSX.Element;
        onSelect: () => void;
    }
>;

export type ClockProps = AccessorProps<{
    ariaLabel?: string;
    locale?: string;
    now?: TimeValue;
    min?: TimeValue;
    max?: TimeValue;
    steps?: ClockSteps;
    hasSeconds?: boolean;
    isTwelveHour?: boolean;
    isDisabled?: boolean;
    gap?: number;
    computeIsTimeDisabled?: (time: TimeValue) => boolean;
    valueSignal: SignalSource<TimeValue | undefined>;
    renderOption: ClockOptionRenderer;
    renderUnit?: ClockUnitRenderer;
    renderColumn?: ClockColumnRenderer;
}>;
