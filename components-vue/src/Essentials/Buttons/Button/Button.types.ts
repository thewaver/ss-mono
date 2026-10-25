import type { BaseButtonProps, BaseButtonValues, ButtonCbs, ButtonFlags } from "@thewaver/ss-components";

import type {
    InteractionControlProps,
    InteractionControlSlots,
    InteractionWrapperProps,
    InteractionWrapperSlots,
} from "../../../Primitives/InteractionWrapper/InteractionWrapper.types";

export type { ButtonCbs };

export type ButtonElementProps = ButtonCbs & InteractionControlProps<ButtonFlags> & BaseButtonValues;

export type ButtonProps = Omit<InteractionWrapperProps<ButtonFlags>, "extraFlags"> &
    BaseButtonProps &
    Pick<InteractionControlProps<ButtonFlags>, "id" | "ariaLabel">;

export type ButtonSlots = Pick<InteractionWrapperSlots<ButtonFlags>, "renderDecoration"> &
    InteractionControlSlots<ButtonFlags>;
