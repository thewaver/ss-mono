import type { ButtonCbs, ButtonFlags, ButtonType } from "@thewaver/ss-components";

import type {
    InteractionControlProps,
    InteractionControlSlots,
    InteractionWrapperProps,
    InteractionWrapperSlots,
} from "../../Primitives/InteractionWrapper/InteractionWrapper.types";

export type { ButtonCbs };

export type ButtonElementProps = ButtonCbs &
    InteractionControlProps<ButtonFlags> & {
        /** What the button does inside a form: nothing, submit it, or reset it. */
        type?: ButtonType;
    };

export type ButtonProps = Omit<InteractionWrapperProps<ButtonFlags>, "extraFlags"> &
    ButtonCbs &
    Pick<InteractionControlProps<ButtonFlags>, "id" | "ariaLabel"> & {
        /**
         * What the button does inside a form. It defaults to doing nothing, so a button in a form does not submit it
         * by accident. A disabled or pending button neither submits nor resets.
         */
        type?: ButtonType;
    };

export type ButtonSlots = Pick<InteractionWrapperSlots<ButtonFlags>, "renderDecoration"> &
    InteractionControlSlots<ButtonFlags>;
