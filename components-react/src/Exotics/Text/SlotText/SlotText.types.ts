import type { ReactNode } from "react";

import type { BaseSlotTextProps, SlotTextSlotFlags } from "@thewaver/ss-components";

export type SlotTextProps = BaseSlotTextProps & {
    /**
     * Draws one character on a turning column. It is told whether its column is growing in or shrinking away, so it
     * can fade or scale while the width changes.
     */
    renderTurning?: (character: string, flags: SlotTextSlotFlags) => ReactNode;
    /**
     * Draws one character that does not turn, such as a separator. It is told whether the slot is growing in or
     * shrinking away, as `renderTurning` is.
     */
    renderFixed?: (character: string, flags: SlotTextSlotFlags) => ReactNode;
};
