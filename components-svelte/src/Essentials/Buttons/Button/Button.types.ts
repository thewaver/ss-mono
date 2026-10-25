import type { BaseButtonProps, BaseButtonValues, ButtonCbs, ButtonFlags } from "@thewaver/ss-components";

import type {
    InteractionControlProps,
    InteractionWrapperProps,
} from "../../../Primitives/InteractionWrapper/InteractionWrapper.types.js";

export type { ButtonCbs };

export type ButtonElementProps = ButtonCbs & InteractionControlProps<ButtonFlags> & BaseButtonValues;

export type ButtonProps = Omit<InteractionWrapperProps<ButtonFlags>, "renderControl" | "extraFlags"> &
    BaseButtonProps &
    Pick<InteractionControlProps<ButtonFlags>, "id" | "ariaLabel" | "renderContent">;
