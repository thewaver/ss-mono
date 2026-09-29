import type { RangeCbs, RangeRenderProps, RangeState, RangeValues } from "@thewaver/ss-components";

import type {
    InteractionControlProps,
    InteractionControlSlots,
    InteractionWrapperProps,
    InteractionWrapperSlots,
} from "../../../Primitives/InteractionWrapper/InteractionWrapper.types";

export type { RangeCbs };

type RangeRequiredState = Required<
    Omit<RangeState, "name" | "ariaLabel" | "thumbLabels" | "computeValueText" | "computeValueAtPoint" | "isRequired">
>;

type RangeOptionalState = Pick<
    RangeState,
    "name" | "ariaLabel" | "thumbLabels" | "computeValueText" | "computeValueAtPoint" | "isRequired"
>;

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

export type RangeProps = Omit<InteractionWrapperProps<RangeRenderProps>, "extraFlags"> &
    RangeCbs &
    Pick<InteractionControlProps<RangeRenderProps>, "id"> &
    RangeState & {
        /** The value. It is the only thing that moves the thumb. Give this or `range`. */
        "value"?: number;
        /** Receives the value as the thumb moves, which is what `v-model:value` binds. */
        "onUpdate:value"?: (value: number) => void;
        /**
         * The two ends of the range. It is the only thing that moves them. A pair's thumbs take `<id>-start` and
         * `<id>-end` as their ids, so a label can name each one, where a single thumb keeps the id as given. Give this
         * or `value`.
         */
        "range"?: RangeValues;
        /** Receives the two ends as either thumb moves, which is what `v-model:range` binds. */
        "onUpdate:range"?: (range: RangeValues) => void;
    };

export type RangeSlots = Pick<InteractionWrapperSlots<RangeRenderProps>, "renderDecoration"> &
    InteractionControlSlots<RangeRenderProps>;
