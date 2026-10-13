import type { BaseButtonValues, ButtonCbs, ButtonFlags, ButtonType } from "@thewaver/ss-components";

import type {
    InteractionControlProps,
    InteractionWrapperProps,
} from "../../../Primitives/InteractionWrapper/InteractionWrapperSolid.types";
import type { AccessorProps, AccessorValues } from "../../../Utils/typeUtils";

export type ButtonElementProps = AccessorProps<
    ButtonCbs &
        InteractionControlProps<ButtonFlags> & {
            /** What the button does inside a form: nothing, submit it, or reset it. */
            type?: ButtonType;
        }
>;

export type ButtonProps = Omit<InteractionWrapperProps<ButtonFlags>, "renderControl" | "extraFlags"> &
    AccessorValues<BaseButtonValues> &
    ButtonCbs &
    AccessorProps<Pick<InteractionControlProps<ButtonFlags>, "id" | "ariaLabel" | "renderContent">>;
