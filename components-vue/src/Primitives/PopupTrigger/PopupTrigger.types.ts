import type { BasePopupTriggerProps, PopupTriggerFlags } from "@thewaver/ss-components";

import type { InteractionControlProps } from "../InteractionWrapper/InteractionWrapper.types";

export type PopupTriggerProps = BasePopupTriggerProps & InteractionControlProps<PopupTriggerFlags>;
