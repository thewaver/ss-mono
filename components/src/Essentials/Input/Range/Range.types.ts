import type { Point2d } from "@thewaver/ss-utils";

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
    onInput?: (values: number[]) => void;
    /**
     * Runs once a change is finished: when a drag lets go, and after every key press, since each press is a whole
     * change of its own. It is handed every thumb's value, as `onInput` is. A drag that ends where it began, or a key
     * that meets an end of the track, changed nothing and reports nothing.
     */
    onChangeEnd?: (values: number[]) => void;
    /** Runs when the pointer arrives over the track. */
    onMouseEnter?: (e: MouseEvent) => void;
    /** Runs when the pointer leaves the track. */
    onMouseLeave?: (e: MouseEvent) => void;
};

export type RangeState = {
    /** The field's name when it is submitted as part of a form. A range with two ends submits them as `<name>-start` and `<name>-end`. */
    name?: string;
    /** Names the range for assistive technology. */
    ariaLabel?: string;
    /** Names each thumb separately, for a range whose ends mean different things. */
    thumbLabels?: string[];
    /**
     * What a thumb's value should be read out as, where the bare number would not mean anything — a price rather
     * than a figure, a weekday rather than its index. It is handed the value and which thumb holds it, counted from
     * zero, and is written to that thumb's `aria-valuetext`. Leave it out and the number is read as it is.
     */
    computeValueText?: (value: number, index: number) => string;
    /**
     * Where on the control a pointer press lands, as a value, for a control whose value is not a distance along a
     * straight track — a knob read by its angle, say. Given this, the range follows the pointer itself from the
     * press until it is let go, rather than letting the thumb slide along its line: each move writes what this
     * answers, clamped into the range and between the neighboring thumb, and rounded to the step the way a key
     * press is. With two thumbs, the one whose value is nearer the answer at the press is the one moved. The
     * keyboard, the role, the bounds, `computeValueText` and `onChangeEnd` behave as they do without it.
     *
     * It is handed the pointer and the control's box, both in the page's client coordinates as a pointer event
     * and `getBoundingClientRect` report them, so the two can be compared directly.
     * `RangeUtils.computeAngularValue` is the formula for a knob.
     */
    computeValueAtPoint?: (point: Point2d, rect: DOMRect) => number;
    /** Whether a value has to be given. It is announced and not enforced, because the library validates nothing. */
    isRequired?: boolean;
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
        Required<
            Omit<
                RangeState,
                "name" | "ariaLabel" | "thumbLabels" | "computeValueText" | "computeValueAtPoint" | "isRequired"
            >
        > &
        Pick<
            RangeState,
            "name" | "ariaLabel" | "thumbLabels" | "computeValueText" | "computeValueAtPoint" | "isRequired"
        > & {
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
                /**
                 * The two ends of the range. It is the only thing that moves them. A pair's thumbs take `<id>-start`
                 * and `<id>-end` as their ids, so a label can name each one, where a single thumb keeps the id as
                 * given.
                 */
                rangeSignal?: SignalSource<RangeValues>;
            }
    >;
