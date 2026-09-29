import { type HoverIntentDefs, type HoverIntentHandle } from "@thewaver/ss-components";
import type { ValuePair } from "../../Utils/typeUtils.js";
/** The Svelte side of {@link HoverIntentUtils}: a panel's open state driven from two element getters. */
export declare namespace HoverIntentSvelteUtils {
    /**
     * Drives a panel's open state from the pointer over its anchor and over the panel itself.
     *
     * {@link HoverIntentUtils.create} with its elements and its open state followed through getters: the listeners
     * follow the two elements, so either may arrive late or change, every close is recorded in the delay group, and
     * so is the component being destroyed while showing. Every option is read when it is needed, so functions and
     * getters reading the component's props always see the current ones.
     *
     * Must run while a component is being set up.
     *
     * @param getAnchorRef The element the pointer rests on to open the panel.
     * @param visibility The panel's open state, read and written.
     * @param defs What {@link HoverIntentUtils.create} takes, and `getPanelRef`, the panel's own element, whose hover
     * keeps it open.
     * @returns Whether the pointer is over the anchor or the panel right now, and a way to drop a pending open.
     */
    const create: (getAnchorRef: () => HTMLElement | undefined, visibility: ValuePair<boolean>, defs: HoverIntentDefs) => HoverIntentHandle;
}
