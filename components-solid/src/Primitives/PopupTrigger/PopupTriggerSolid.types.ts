import type { BasePopupTriggerCbs, BasePopupTriggerValues, PopupTriggerFlags } from "@thewaver/ss-components";

import type { AccessorProps, AccessorValues } from "../../Utils/typeUtils";
import type { InteractionControlProps } from "../InteractionWrapper/InteractionWrapperSolid.types";

export type PopupTriggerProps = AccessorProps<InteractionControlProps<PopupTriggerFlags>> &
    AccessorValues<BasePopupTriggerValues> &
    BasePopupTriggerCbs;
