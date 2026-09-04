import type { Accessor, JSX } from "solid-js";

import type { InteractionFlags } from "../../Abstracts/InteractionTracker/InteractionTracker.types";
import type { AccessorProps, SignalSource } from "../../Utils/typeUtils";

export type TimelineSpan = {
    start: number;
    end: number;
};

export type TimelineTick = {
    value: number;
    ratio: number;
    isMajor: boolean;
};

export type TimelineStepPair = {
    step: number;
    majorStep: number;
};

export type TimelinePlacement = {
    index: number;
    order: number;
    lane: number;
    startRatio: number;
    endRatio: number;
    isInView: boolean;
};

export type TimelineItemRenderProps = {
    index: number;
    placement: TimelinePlacement;
    span: TimelineSpan;
    isFocused: boolean;
};

export type TimelineStop = {
    index: number;
    order: number;
    lane: number;
    span: TimelineSpan;
};

export type TimelineStep = "previous" | "next" | "laneBefore" | "laneAfter" | "first" | "last";

export type TimelineController = {
    getView: Accessor<TimelineSpan>;
    zoomBy: (factor: number, focusRatio?: number) => void;
    panBy: (ratio: number) => void;
    showSpan: (span: TimelineSpan) => void;
};

export type TimelineProps<T> = AccessorProps<{
    range: TimelineSpan;
    items: T[];
    laneSize: number;
    laneGap?: number;
    axisSize?: number;
    laneCount?: number;
    minViewExtent?: number;
    tickSteps?: number[];
    minTickGap?: number;
    ariaLabel?: string;
    isPannable?: boolean;
    isZoomable?: boolean;
    isDisabled?: boolean;
    viewSignal?: SignalSource<TimelineSpan>;
    computeSpan: (item: T, index: number) => TimelineSpan;
    computeLane?: (item: T, index: number) => number;
    computeItemAriaLabel?: (item: T, index: number) => string;
    computeIsItemDisabled?: (item: T, index: number) => boolean;
    renderTick?: (getTick: Accessor<TimelineTick>) => JSX.Element;
    renderItem: (getItem: Accessor<T>, getFlags: () => InteractionFlags<TimelineItemRenderProps>) => JSX.Element;
    onItemActivate?: (item: T, index: number) => void;
    onMount?: (controller: TimelineController) => void;
}>;

export type TimelineItemProps = {
    id: string;
    ariaLabel?: string;
    posInSet: number;
    setSize: number;
    flags: InteractionFlags<TimelineItemRenderProps>;
    ref: (element: HTMLElement) => void;
    renderContent: (getFlags: () => InteractionFlags<TimelineItemRenderProps>) => JSX.Element;
    onActivate: () => void;
    onFocused: () => void;
};
