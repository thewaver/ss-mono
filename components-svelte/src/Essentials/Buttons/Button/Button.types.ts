import type { BaseButtonProps, ButtonCbs, ButtonFlags, ButtonType } from "@thewaver/ss-components";

import type {
    InteractionControlProps,
    InteractionWrapperProps,
} from "../../../Primitives/InteractionWrapper/InteractionWrapper.types.js";

export type { ButtonCbs };

export type ButtonElementProps = ButtonCbs &
    InteractionControlProps<ButtonFlags> & {
        /** What the button does inside a form: nothing, submit it, or reset it. */
        type?: ButtonType;
    };

export type ButtonProps = Omit<InteractionWrapperProps<ButtonFlags>, "renderControl" | "extraFlags"> &
    BaseButtonProps &
    Pick<InteractionControlProps<ButtonFlags>, "id" | "ariaLabel" | "renderContent">;
