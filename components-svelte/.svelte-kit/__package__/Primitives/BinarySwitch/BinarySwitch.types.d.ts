import type { BinarySwitchFlags, BinarySwitchType } from "@thewaver/ss-components";
import type { InteractionControlProps, InteractionWrapperProps } from "../InteractionWrapper/InteractionWrapper.types.js";
export type BinarySwitchCbs = {
    /** Runs when the switch is turned on or off. */
    onChange?: (isChecked: boolean) => void;
    /** Runs when the pointer arrives over the switch. */
    onMouseEnter?: (e: MouseEvent) => void;
    /** Runs when the pointer leaves the switch. */
    onMouseLeave?: (e: MouseEvent) => void;
};
export type BinarySwitchState = {
    /** Whether this behaves as a checkbox, which can be turned off again, or as a radio, which cannot. */
    type: BinarySwitchType;
    /** Whether it announces itself as a switch rather than a checkbox, which changes what a reader hears it as. */
    isSwitch?: boolean;
    /** The field's name when it is submitted as part of a form. */
    name?: string;
    /** Names the switch for assistive technology, where no label already does. */
    ariaLabel?: string;
    /**
     * Whether a value has to be given. It is announced and not enforced, because the library validates nothing. A
     * radio leaves this to its group.
     */
    isRequired?: boolean;
    /** Whether the switch is on. */
    isChecked: boolean;
    /** Whether the switch stands for a group whose members disagree, which is the third state between on and off. */
    isMixed?: boolean;
};
export type BinarySwitchElementProps = BinarySwitchCbs & InteractionControlProps<BinarySwitchFlags> & BinarySwitchState;
export type BinarySwitchProps = Omit<InteractionWrapperProps<BinarySwitchFlags>, "renderControl" | "extraFlags"> & BinarySwitchCbs & Pick<InteractionControlProps<BinarySwitchFlags>, "id" | "renderContent"> & BinarySwitchState;
export type BinarySwitchPresetProps = Omit<BinarySwitchProps, "type" | "isSwitch" | "isChecked"> & {
    /** Whether the switch is on. Bind it with `bind:checked`; it is the only thing that turns the switch. */
    checked: boolean;
};
