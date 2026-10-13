import type { ReactNode } from "react";

import type {
    BaseClockProps,
    ClockOption,
    ClockRenderProps,
    ClockUnit,
    InteractionFlags,
} from "@thewaver/ss-components";
import type { TimeValue } from "@thewaver/ss-utils";

import type { InteractionControlProps } from "../../../Primitives/InteractionWrapper/InteractionWrapper.types";

export type ClockOptionRenderer = (option: ClockOption, flags: InteractionFlags<ClockRenderProps>) => ReactNode;

export type ClockUnitRenderer = (name: string, unit: ClockUnit) => ReactNode;

export type ClockColumnRenderer = (renderOptions: () => ReactNode, unit: ClockUnit) => ReactNode;

export type ClockOptionProps = Omit<InteractionControlProps<ClockRenderProps>, "ariaLabel"> & {
    /** Names the option for assistive technology, since the cell often shows only its number. Required here: a bare number is not a time. */
    ariaLabel: string;
    /** Runs when this option is picked. */
    onSelect: () => void;
};

export type ClockProps = BaseClockProps & {
    /** Which time is picked, and how to change it. It is the only thing that picks one. */
    value: readonly [TimeValue | undefined, (value: TimeValue | undefined) => void];
    /** Draws one option. */
    renderOption: ClockOptionRenderer;
    /** Draws the heading for one unit's column. */
    renderUnit?: ClockUnitRenderer;
    /** Draws one unit's column. */
    renderColumn?: ClockColumnRenderer;
};
