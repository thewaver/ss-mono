import type { RangeRenderProps, RangeState, RangeValues } from "@thewaver/ss-components";
import type { InteractionControlProps, InteractionWrapperProps } from "../../../Primitives/InteractionWrapper/InteractionWrapper.types.js";
export type RangeCbs = {
    /** Runs as the thumbs move, with every thumb's value. */
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
type RangeRequiredState = Required<Omit<RangeState, "name" | "ariaLabel" | "thumbLabels" | "computeValueText" | "computeValueAtPoint" | "isRequired">>;
type RangeOptionalState = Pick<RangeState, "name" | "ariaLabel" | "thumbLabels" | "computeValueText" | "computeValueAtPoint" | "isRequired">;
export type RangeElementProps = RangeCbs & InteractionControlProps<RangeRenderProps> & RangeRequiredState & RangeOptionalState & {
    /** Where each thumb currently sits. */
    values: number[];
    /** Whether the thumbs can be reached by tabbing. */
    isTabbable?: boolean;
    /** Moves one thumb to a value. */
    setValue: (index: number, value: number) => void;
    /** Says which thumb should show a focus ring, or clears it. */
    setFocusVisibleThumb: (index?: number) => void;
};
export type RangeProps = Omit<InteractionWrapperProps<RangeRenderProps>, "renderControl" | "extraFlags"> & RangeCbs & Pick<InteractionControlProps<RangeRenderProps>, "id" | "renderContent"> & RangeState & {
    /** The value. Bind it with `bind:value`; it is the only thing that moves the thumb. Give this or `range`. */
    value?: number;
    /**
     * The two ends of the range. Bind it with `bind:range`; it is the only thing that moves them. A pair's thumbs
     * take `<id>-start` and `<id>-end` as their ids, so a label can name each one, where a single thumb keeps the
     * id as given. Give this or `value`.
     */
    range?: RangeValues;
};
export {};
