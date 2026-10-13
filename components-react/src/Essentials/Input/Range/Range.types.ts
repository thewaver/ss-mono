import type { MouseEvent } from "react";

import type { BaseRangeCbs, BaseRangeValues, RangeRenderProps, RangeValues } from "@thewaver/ss-components";

import type {
    InteractionControlProps,
    InteractionWrapperProps,
} from "../../../Primitives/InteractionWrapper/InteractionWrapper.types";

export type RangeCbs = BaseRangeCbs & {
    /** Runs when the pointer arrives over the track. */
    onMouseEnter?: (e: MouseEvent<HTMLInputElement>) => void;
    /** Runs when the pointer leaves the track. */
    onMouseLeave?: (e: MouseEvent<HTMLInputElement>) => void;
};

type RangeRequiredState = Required<Omit<BaseRangeValues, "name" | "ariaLabel" | "thumbLabels" | "isRequired">>;

type RangeOptionalState = Pick<BaseRangeValues, "name" | "ariaLabel" | "thumbLabels" | "isRequired">;

export type RangeElementProps = RangeCbs &
    InteractionControlProps<RangeRenderProps> &
    RangeRequiredState &
    RangeOptionalState & {
        /** Where each thumb currently sits. */
        values: number[];
        /** Whether the thumbs can be reached by tabbing. */
        isTabbable?: boolean;
        /** Moves one thumb to a value. */
        setValue: (index: number, value: number) => void;
        /** Says which thumb should show a focus ring, or clears it. */
        setFocusVisibleThumb: (index?: number) => void;
    };

export type RangeProps = Omit<InteractionWrapperProps<RangeRenderProps>, "renderControl" | "extraFlags"> &
    RangeCbs &
    Pick<InteractionControlProps<RangeRenderProps>, "id" | "renderContent"> &
    BaseRangeValues & {
        /** The value, and how to change it. It is the only thing that moves the thumb. Give this or `range`. */
        value?: readonly [number, (value: number) => void];
        /**
         * The two ends of the range, and how to change them. It is the only thing that moves them. A pair's thumbs
         * take `<id>-start` and `<id>-end` as their ids, so a label can name each one, where a single thumb keeps the
         * id as given. Give this or `value`.
         */
        range?: readonly [RangeValues, (range: RangeValues) => void];
    };
