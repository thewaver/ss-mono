import type { BaseRangeValues, RangeCbs, RangeRenderProps, RangeValues } from "@thewaver/ss-components";

import type {
    InteractionControlProps,
    InteractionWrapperProps,
} from "../../../Primitives/InteractionWrapper/InteractionWrapperSolid.types";
import type { AccessorProps, AccessorValues, SignalSource } from "../../../Utils/typeUtils";

export type RangeElementProps = AccessorValues<
    Required<Omit<BaseRangeValues, "name" | "ariaLabel" | "thumbLabels" | "isRequired">> &
        Pick<BaseRangeValues, "name" | "ariaLabel" | "thumbLabels" | "isRequired"> & {
            /** Whether the thumbs can be reached by tabbing. */
            isTabbable?: boolean;
        }
> &
    AccessorProps<
        RangeCbs &
            Omit<InteractionControlProps<RangeRenderProps>, "ariaLabel"> & {
                /** Where each thumb currently sits. */
                values: number[];
                /** Moves one thumb to a value. */
                setValue: (index: number, value: number) => void;
                /** Says which thumb should show a focus ring, or clears it. */
                setFocusVisibleThumb: (index?: number) => void;
            }
    >;

export type RangeProps = Omit<InteractionWrapperProps<RangeRenderProps>, "renderControl" | "extraFlags"> &
    AccessorValues<BaseRangeValues> &
    RangeCbs &
    AccessorProps<
        Pick<InteractionControlProps<RangeRenderProps>, "id" | "renderContent"> & {
            /** The value. It is the only thing that moves the thumb. */
            value?: SignalSource<number>;
            /**
             * The two ends of the range. It is the only thing that moves them. A pair's thumbs take `<id>-start`
             * and `<id>-end` as their ids, so a label can name each one, where a single thumb keeps the id as
             * given.
             */
            range?: SignalSource<RangeValues>;
        }
    >;
