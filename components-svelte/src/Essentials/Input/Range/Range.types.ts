import type { BaseRangeValues, RangeCbs, RangeRenderProps } from "@thewaver/ss-components";
import type { Span } from "@thewaver/ss-utils";

import type {
    InteractionControlProps,
    InteractionWrapperProps,
} from "../../../Primitives/InteractionWrapper/InteractionWrapper.types.js";

export type { RangeCbs };

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
        /** The value. Bind it with `bind:value`; it is the only thing that moves the thumb. Give this or `range`. */
        value?: number;
        /**
         * The two ends of the range. Bind it with `bind:range`; it is the only thing that moves them. A pair's thumbs
         * take `<id>-start` and `<id>-end` as their ids, so a label can name each one, where a single thumb keeps the
         * id as given. Give this or `value`.
         */
        range?: Span;
    };
