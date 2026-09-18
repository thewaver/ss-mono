import type { CheckedState } from "../../Abstracts/CheckedState/CheckedState.types";
import type { AccessorProps, SignalSource } from "../../Utils/typeUtils";
import type { InteractionControlProps, InteractionWrapperProps } from "../InteractionWrapper/InteractionWrapper.types";

export type BinarySwitchType = "checkbox" | "radio";

export type BinarySwitchFlags = {
    checkedState: CheckedState;
};

export type BinarySwitchCbs = {
    /** Runs when the switch is turned on or off. */
    onChange?: (isChecked: boolean) => void | Promise<void>;
    /** Runs when the pointer arrives over the switch. */
    onMouseEnter?: (e: MouseEvent) => void | Promise<void>;
    /** Runs when the pointer leaves the switch. */
    onMouseLeave?: (e: MouseEvent) => void | Promise<void>;
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
    /** Whether the switch is on. */
    isChecked: boolean;
    /** Whether the switch stands for a group whose members disagree, which is the third state between on and off. */
    isMixed?: boolean;
};

export type BinarySwitchElementProps = AccessorProps<
    BinarySwitchCbs & InteractionControlProps<BinarySwitchFlags> & BinarySwitchState
>;

export type BinarySwitchProps = Omit<InteractionWrapperProps<BinarySwitchFlags>, "renderControl" | "extraFlags"> &
    AccessorProps<
        BinarySwitchCbs & Pick<InteractionControlProps<BinarySwitchFlags>, "id" | "renderContent"> & BinarySwitchState
    >;

export type BinarySwitchPresetProps = Omit<BinarySwitchProps, "type" | "isSwitch" | "name" | "isChecked"> &
    AccessorProps<{
        /** Whether the switch is on. It is the only thing that turns it. */
        checkedSignal: SignalSource<boolean>;
    }>;
