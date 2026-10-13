import type { MouseEvent } from "react";

import type { BaseBinarySwitchCbs, BaseBinarySwitchValues, BinarySwitchFlags } from "@thewaver/ss-components";

import type { InteractionControlProps, InteractionWrapperProps } from "../InteractionWrapper/InteractionWrapper.types";

export type BinarySwitchCbs = BaseBinarySwitchCbs & {
    /** Runs when the pointer arrives over the switch. */
    onMouseEnter?: (e: MouseEvent<HTMLInputElement>) => void;
    /** Runs when the pointer leaves the switch. */
    onMouseLeave?: (e: MouseEvent<HTMLInputElement>) => void;
};

export type BinarySwitchElementProps = BaseBinarySwitchValues &
    BinarySwitchCbs &
    InteractionControlProps<BinarySwitchFlags>;

export type BinarySwitchProps = Omit<InteractionWrapperProps<BinarySwitchFlags>, "renderControl" | "extraFlags"> &
    BaseBinarySwitchValues &
    BinarySwitchCbs &
    Pick<InteractionControlProps<BinarySwitchFlags>, "id" | "renderContent">;

export type BinarySwitchPresetProps = Omit<BinarySwitchProps, "type" | "isSwitch" | "isChecked"> & {
    /** Whether the switch is on, and how to change it. It is the only thing that turns it. */
    checked: readonly [boolean, (isChecked: boolean) => void];
};
