import type { VNodeChild } from "vue";

import type { BaseInteractionSettingsValues } from "@thewaver/ss-components";

export type InteractionSettingsProps = BaseInteractionSettingsValues;

export type InteractionSettingsSlots = {
    /** Everything the settings apply to. */
    default?: () => VNodeChild;
};
