import type { BaseButtonValues, ButtonCbs, ButtonFlags } from "@thewaver/ss-components";

import type {
    InteractionControlProps,
    InteractionWrapperProps,
} from "../../../Primitives/InteractionWrapper/InteractionWrapperSolid.types";
import type { AccessorProps, AccessorValues } from "../../../Utils/typeUtils";

export type ButtonElementProps = AccessorProps<ButtonCbs & InteractionControlProps<ButtonFlags> & BaseButtonValues>;

export type ButtonProps = Omit<InteractionWrapperProps<ButtonFlags>, "renderControl" | "extraFlags"> &
    AccessorValues<BaseButtonValues> &
    ButtonCbs &
    AccessorProps<Pick<InteractionControlProps<ButtonFlags>, "id" | "ariaLabel" | "renderContent">>;
