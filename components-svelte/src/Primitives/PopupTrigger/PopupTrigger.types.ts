import type { BasePopupTriggerProps, PopupTriggerFlags } from "@thewaver/ss-components";

import type { InteractionControlProps } from "../InteractionWrapper/InteractionWrapper.types.js";

export type PopupTriggerProps = BasePopupTriggerProps & InteractionControlProps<PopupTriggerFlags>;
