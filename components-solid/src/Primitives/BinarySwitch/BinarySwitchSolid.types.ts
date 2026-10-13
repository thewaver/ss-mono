import type { BaseBinarySwitchValues, BinarySwitchCbs, BinarySwitchFlags } from "@thewaver/ss-components";

import type { AccessorProps, AccessorValues, SignalSource } from "../../Utils/typeUtils";
import type {
    InteractionControlProps,
    InteractionWrapperProps,
} from "../InteractionWrapper/InteractionWrapperSolid.types";

export type BinarySwitchElementProps = AccessorValues<BaseBinarySwitchValues> &
    BinarySwitchCbs &
    AccessorProps<Omit<InteractionControlProps<BinarySwitchFlags>, "ariaLabel">>;

export type BinarySwitchProps = Omit<InteractionWrapperProps<BinarySwitchFlags>, "renderControl" | "extraFlags"> &
    AccessorValues<BaseBinarySwitchValues> &
    BinarySwitchCbs &
    AccessorProps<Pick<InteractionControlProps<BinarySwitchFlags>, "id" | "renderContent">>;

export type BinarySwitchPresetProps = Omit<BinarySwitchProps, "type" | "isSwitch" | "isChecked"> &
    AccessorProps<{
        /** Whether the switch is on. It is the only thing that turns it. */
        checked: SignalSource<boolean>;
    }>;
