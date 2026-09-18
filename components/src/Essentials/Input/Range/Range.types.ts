import type {
    InteractionControlProps,
    InteractionWrapperProps,
} from "../../../Primitives/InteractionWrapper/InteractionWrapper.types";
import type { AccessorProps, SignalSource } from "../../../Utils/typeUtils";

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
    /** Whether the track runs across the page or down it. */
    orientation: RangeOrientation;
    /** Where each thumb currently sits. */
    values: number[];
    /**
     * Where each thumb sits as a share of the track, which is what a consumer positions against without redoing the
     * arithmetic.
     */
    ratios: number[];
    /** The stretch of track between the thumbs, which is the part usually painted as filled. */
    fill: RangeSpan;
    /** Which thumb should show a focus ring, or nothing when the track was reached by pointer. */
    focusVisibleThumb?: number;
};

export type RangeCbs = {
    /** Runs as the thumbs move. */
    onInput?: (values: number[]) => void | Promise<void>;
    /** Runs when the pointer arrives over the track. */
    onMouseEnter?: (e: MouseEvent) => void | Promise<void>;
    /** Runs when the pointer leaves the track. */
    onMouseLeave?: (e: MouseEvent) => void | Promise<void>;
};

export type RangeState = {
    /** The field's name when it is submitted as part of a form. */
    name?: string;
    /** Names the range for assistive technology. */
    ariaLabel?: string;
    /** Names each thumb separately, for a range whose ends mean different things. */
    thumbLabels?: string[];
    /** Whether the track runs across the page or down it. */
    orientation?: RangeOrientation;
    /** The smallest value a thumb can take. */
    min?: number;
    /** The largest value a thumb can take. */
    max?: number;
    /** How far one step moves a thumb. */
    step?: number;
    /** How large a thumb is. The track reserves room for it so the ends stay reachable. */
    thumbSize?: number;
};

export type RangeElementProps = AccessorProps<
    RangeCbs &
        InteractionControlProps<RangeRenderProps> &
        Required<Omit<RangeState, "name" | "ariaLabel" | "thumbLabels">> &
        Pick<RangeState, "name" | "ariaLabel" | "thumbLabels"> & {
            /** Where each thumb currently sits. */
            values: number[];
            /** Whether the thumbs can be reached by tabbing. */
            isTabbable?: boolean;
            /** Moves one thumb to a value. */
            setValue: (index: number, value: number) => void;
            /** Says which thumb should show a focus ring, or clears it. */
            setFocusVisibleThumb: (index?: number) => void;
        }
>;

export type RangeProps = Omit<InteractionWrapperProps<RangeRenderProps>, "renderControl" | "extraFlags"> &
    AccessorProps<
        RangeCbs &
            Pick<InteractionControlProps<RangeRenderProps>, "id" | "renderContent"> &
            RangeState & {
                /** The value. It is the only thing that moves the thumb. */
                valueSignal?: SignalSource<number>;
                /** The two ends of the range. It is the only thing that moves them. */
                rangeSignal?: SignalSource<RangeValues>;
            }
    >;
