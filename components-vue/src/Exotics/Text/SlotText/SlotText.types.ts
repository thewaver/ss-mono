import type { VNodeChild } from "vue";

import type { BaseSlotTextProps, SlotTextSlotFlags } from "@thewaver/ss-components";

export type SlotTextProps = BaseSlotTextProps;

export type SlotTextSlots = {
    /**
     * Draws one character on a turning column. It is told whether its column is growing in or shrinking away, so it
     * can fade or scale while the width changes. Left out, the character is drawn as plain text.
     */
    renderTurning: (props: { character: string; flags: SlotTextSlotFlags }) => VNodeChild;
    /**
     * Draws one character that does not turn, such as a separator. It is told whether the slot is growing in or
     * shrinking away, as `renderTurning` is. Left out, the character is drawn as plain text.
     */
    renderFixed: (props: { character: string; flags: SlotTextSlotFlags }) => VNodeChild;
};
