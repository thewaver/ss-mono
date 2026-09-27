import type { BinarySwitchCbs, BinarySwitchFlags, BinarySwitchState } from "@thewaver/ss-components";

import type { AccessorProps, SignalSource } from "../../Utils/typeUtils";
import type {
    InteractionControlProps,
    InteractionWrapperProps,
} from "../InteractionWrapper/InteractionWrapperSolid.types";

export type BinarySwitchElementProps = AccessorProps<
    BinarySwitchCbs & InteractionControlProps<BinarySwitchFlags> & BinarySwitchState
>;

export type BinarySwitchProps = Omit<InteractionWrapperProps<BinarySwitchFlags>, "renderControl" | "extraFlags"> &
    AccessorProps<
        BinarySwitchCbs & Pick<InteractionControlProps<BinarySwitchFlags>, "id" | "renderContent"> & BinarySwitchState
    >;

export type BinarySwitchPresetProps = Omit<BinarySwitchProps, "type" | "isSwitch" | "isChecked"> &
    AccessorProps<{
        /** Whether the switch is on. It is the only thing that turns it. */
        checkedSignal: SignalSource<boolean>;
    }>;
