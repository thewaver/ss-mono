import type { ReactNode } from "react";

import type { BaseInteractionSettingsValues } from "@thewaver/ss-components";

export type InteractionSettingsProps = BaseInteractionSettingsValues & {
    /** Everything the settings apply to. */
    children?: ReactNode;
};
