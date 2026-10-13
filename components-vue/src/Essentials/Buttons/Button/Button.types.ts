import type { BaseButtonProps, ButtonCbs, ButtonFlags, ButtonType } from "@thewaver/ss-components";

import type {
    InteractionControlProps,
    InteractionControlSlots,
    InteractionWrapperProps,
    InteractionWrapperSlots,
} from "../../../Primitives/InteractionWrapper/InteractionWrapper.types";

export type { ButtonCbs };

export type ButtonElementProps = ButtonCbs &
    InteractionControlProps<ButtonFlags> & {
        /** What the button does inside a form: nothing, submit it, or reset it. */
        type?: ButtonType;
    };

export type ButtonProps = Omit<InteractionWrapperProps<ButtonFlags>, "extraFlags"> &
    BaseButtonProps &
    Pick<InteractionControlProps<ButtonFlags>, "id" | "ariaLabel">;

export type ButtonSlots = Pick<InteractionWrapperSlots<ButtonFlags>, "renderDecoration"> &
    InteractionControlSlots<ButtonFlags>;
