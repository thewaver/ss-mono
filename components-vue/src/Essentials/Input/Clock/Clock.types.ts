import type { VNodeChild } from "vue";

import type {
    BaseClockProps,
    ClockOption,
    ClockRenderProps,
    ClockUnit,
    InteractionFlags,
} from "@thewaver/ss-components";
import type { TimeValue } from "@thewaver/ss-utils";

import type { InteractionControlProps } from "../../../Primitives/InteractionWrapper/InteractionWrapper.types";

export type ClockOptionRenderer = (props: {
    option: ClockOption;
    flags: InteractionFlags<ClockRenderProps>;
}) => VNodeChild;

export type ClockUnitRenderer = (props: { name: string; unit: ClockUnit }) => VNodeChild;

export type ClockColumnRenderer = (props: { renderOptions: () => VNodeChild; unit: ClockUnit }) => VNodeChild;

export type ClockOptionProps = Omit<InteractionControlProps<ClockRenderProps>, "ariaLabel"> & {
    /** Names the option for assistive technology, since the cell often shows only its number. Required here: a bare number is not a time. */
    ariaLabel: string;
    /** Runs when this option is picked. */
    onSelect: () => void;
};

export type ClockProps = BaseClockProps & {
    /** Which time is picked, which is what `v-model:value` binds. It is the only thing that picks one. */
    "value": TimeValue | undefined;
    /** Receives the time picked. */
    "onUpdate:value"?: (value: TimeValue | undefined) => void;
};

export type ClockSlots = {
    /** Draws one option. */
    renderOption: ClockOptionRenderer;
    /** Draws the heading for one unit's column. */
    renderUnit?: ClockUnitRenderer;
    /**
     * Draws one unit's column. `renderOptions` draws the column's options, from a template as
     * `<component :is="renderOptions" />`. Left out, the options are drawn as they are.
     */
    renderColumn?: ClockColumnRenderer;
};
