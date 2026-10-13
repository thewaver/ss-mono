import type { Accessor, JSX } from "solid-js";

import type { BaseSlotTextCbs, BaseSlotTextValues, SlotTextSlotFlags } from "@thewaver/ss-components";

import type { AccessorValues } from "../../../Utils/typeUtils";

export type SlotTextProps = AccessorValues<BaseSlotTextValues> &
    BaseSlotTextCbs & {
        /**
         * Draws one character on a turning column. It is told whether its column is growing in or shrinking away, so it
         * can fade or scale while the width changes.
         */
        renderTurning?: (getCharacter: Accessor<string>, getFlags: Accessor<SlotTextSlotFlags>) => JSX.Element;
        /**
         * Draws one character that does not turn, such as a separator. It is told whether the slot is growing in or
         * shrinking away, as `renderTurning` is.
         */
        renderFixed?: (getCharacter: Accessor<string>, getFlags: Accessor<SlotTextSlotFlags>) => JSX.Element;
    };
