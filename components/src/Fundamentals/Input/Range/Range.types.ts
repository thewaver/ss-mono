import type { AccessorProps, SignalSource } from "../../../Utils/typeUtils";
import type {
    InteractionControlProps,
    InteractionWrapperProps,
} from "../../InteractionWrapper/InteractionWrapper.types";

export type RangeOrientation = "horizontal" | "vertical";

export type RangeValues = {
    start: number;
    end: number;
};

export type RangeSpan = {
    start: number;
    end: number;
};

export type RangeRenderProps = {
    orientation: RangeOrientation;
    values: number[];
    ratios: number[];
    fill: RangeSpan;
    focusVisibleThumb?: number;
};

export type RangeCbs = {
    onInput?: (values: number[]) => void | Promise<void>;
    onMouseEnter?: (e: MouseEvent) => void | Promise<void>;
    onMouseLeave?: (e: MouseEvent) => void | Promise<void>;
};

export type RangeState = {
    name?: string;
    ariaLabel?: string;
    thumbLabels?: string[];
    orientation?: RangeOrientation;
    min?: number;
    max?: number;
    step?: number;
    thumbSize?: number;
};

export type RangeElementProps = AccessorProps<
    RangeCbs &
        InteractionControlProps<RangeRenderProps> &
        Required<Omit<RangeState, "name" | "ariaLabel" | "thumbLabels">> &
        Pick<RangeState, "name" | "ariaLabel" | "thumbLabels"> & {
            values: number[];
            isTabbable?: boolean;
            setValue: (index: number, value: number) => void;
            setFocusVisibleThumb: (index?: number) => void;
        }
>;

export type RangeProps = Omit<InteractionWrapperProps<RangeRenderProps>, "renderControl" | "extraFlags"> &
    AccessorProps<
        RangeCbs &
            Pick<InteractionControlProps<RangeRenderProps>, "id" | "renderContent"> &
            RangeState & {
                valueSignal?: SignalSource<number>;
                rangeSignal?: SignalSource<RangeValues>;
            }
    >;
