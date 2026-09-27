import type { RangeCbs, RangeRenderProps, RangeState, RangeValues } from "@thewaver/ss-components";

import type {
    InteractionControlProps,
    InteractionWrapperProps,
} from "../../../Primitives/InteractionWrapper/InteractionWrapperSolid.types";
import type { AccessorProps, SignalSource } from "../../../Utils/typeUtils";

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
