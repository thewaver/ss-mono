import type { Accessor, JSX } from "solid-js";

import type {
    BaseClockCbs,
    BaseClockValues,
    ClockOption,
    ClockRenderProps,
    ClockUnit,
    InteractionFlags,
} from "@thewaver/ss-components";
import type { TimeValue } from "@thewaver/ss-utils";

import type { InteractionControlProps } from "../../../Primitives/InteractionWrapper/InteractionWrapperSolid.types";
import type { AccessorProps, AccessorValues, SignalSource } from "../../../Utils/typeUtils";

export type ClockOptionRenderer = (
    getOption: Accessor<ClockOption>,
    getRenderProps: () => InteractionFlags<ClockRenderProps>,
) => JSX.Element;

export type ClockUnitRenderer = (name: string, unit: ClockUnit) => JSX.Element;

export type ClockColumnRenderer = (renderOptions: () => JSX.Element, unit: ClockUnit) => JSX.Element;

export type ClockOptionProps = AccessorProps<
    Omit<InteractionControlProps<ClockRenderProps>, "renderContent"> & {
        /** Names the option for assistive technology, since the cell often shows only its number. Required here: a bare number is not a time. */
        ariaLabel: string;
        /** Draws the option. */
        renderContent: (getRenderProps: () => InteractionFlags<ClockRenderProps>) => JSX.Element;
        /** Runs when this option is picked. */
        onSelect: () => void;
    }
>;

export type ClockProps = AccessorValues<BaseClockValues> &
    BaseClockCbs & {
        /** Which time is picked. It is the only thing that picks one. */
        value: SignalSource<TimeValue | undefined>;
        /** Draws one option. */
        renderOption: ClockOptionRenderer;
        /** Draws the heading for one unit's column. */
        renderUnit?: ClockUnitRenderer;
        /** Draws one unit's column. */
        renderColumn?: ClockColumnRenderer;
    };
