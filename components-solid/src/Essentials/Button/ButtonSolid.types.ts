import type { ButtonCbs, ButtonFlags, ButtonType } from "@thewaver/ss-components";

import type {
    InteractionControlProps,
    InteractionWrapperProps,
} from "../../Primitives/InteractionWrapper/InteractionWrapperSolid.types";
import type { AccessorProps } from "../../Utils/typeUtils";

export type ButtonElementProps = AccessorProps<
    ButtonCbs &
        InteractionControlProps<ButtonFlags> & {
            /** What the button does inside a form: nothing, submit it, or reset it. */
            type?: ButtonType;
        }
>;

export type ButtonProps = Omit<InteractionWrapperProps<ButtonFlags>, "renderControl" | "extraFlags"> &
    AccessorProps<
        ButtonCbs &
            Pick<InteractionControlProps<ButtonFlags>, "id" | "ariaLabel" | "renderContent"> & {
                /**
                 * What the button does inside a form. It defaults to doing nothing, so a button in a form
                 * does not submit it by accident. A disabled or pending button neither submits nor resets.
                 */
                type?: ButtonType;
            }
    >;
