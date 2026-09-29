import type { Snippet } from "svelte";
import type { ClockOption, ClockRenderProps, ClockSteps, ClockUnit, InteractionFlags } from "@thewaver/ss-components";
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
export type ClockProps = {
    /** Names the clock for assistive technology. */
    ariaLabel?: string;
    /** Which country's conventions the times are written in. */
    locale?: string;
    /** What counts as now, so a consumer can hold it still rather than letting it follow the clock. */
    now?: TimeValue;
    /** The earliest time that can be picked. */
    minValue?: TimeValue;
    /** The latest time that can be picked. */
    maxValue?: TimeValue;
    /** How far apart the offered times are, per unit. */
    steps?: ClockSteps;
    /** Whether seconds are offered as well as hours and minutes. */
    hasSeconds?: boolean;
    /** Whether times are written as twelve hours with a morning and afternoon marker, or as twenty-four. */
    isTwelveHour?: boolean;
    /** Turns the clock off, so no time can be picked. */
    isDisabled?: boolean;
    /** The space between columns. */
    gap?: number;
    /** Whether one time can be picked, for rules a plain earliest and latest cannot express. */
    computeIsTimeDisabled?: (time: TimeValue) => boolean;
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
