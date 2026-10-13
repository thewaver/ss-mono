import type { Snippet } from "svelte";

import type {
    BaseClockProps,
    ClockOption,
    ClockRenderProps,
    ClockUnit,
    InteractionFlags,
} from "@thewaver/ss-components";
import type { TimeValue } from "@thewaver/ss-utils";

import type { InteractionControlProps } from "../../../Primitives/InteractionWrapper/InteractionWrapper.types.js";

export type ClockOptionRenderer = Snippet<[option: ClockOption, flags: InteractionFlags<ClockRenderProps>]>;

export type ClockUnitRenderer = Snippet<[name: string, unit: ClockUnit]>;

export type ClockColumnRenderer = Snippet<[renderOptions: Snippet, unit: ClockUnit]>;

export type ClockOptionProps = Omit<InteractionControlProps<ClockRenderProps>, "ariaLabel"> & {
    /** Names the option for assistive technology, since the cell often shows only its number. Required here: a bare number is not a time. */
    ariaLabel: string;
    /** Runs when this option is picked. */
    onSelect: () => void;
};

export type ClockProps = BaseClockProps & {
    /** Which time is picked. Bind it with `bind:value`; it is the only thing that picks one. */
    value: TimeValue | undefined;
    /** Draws one option. */
    renderOption: ClockOptionRenderer;
    /** Draws the heading for one unit's column. */
    renderUnit?: ClockUnitRenderer;
    /**
     * Draws one unit's column. It is handed the column's options as a snippet, drawn with `{@render renderOptions()}`,
     * so the consumer decides what surrounds them.
     */
    renderColumn?: ClockColumnRenderer;
};
