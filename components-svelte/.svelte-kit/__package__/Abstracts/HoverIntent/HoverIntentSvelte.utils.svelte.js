import { untrack } from "svelte";
import { HoverIntentUtils } from "@thewaver/ss-components";
/** The Svelte side of {@link HoverIntentUtils}: a panel's open state driven from two element getters. */
export var HoverIntentSvelteUtils;
(function (HoverIntentSvelteUtils) {
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
    HoverIntentSvelteUtils.create = (getAnchorRef, visibility, defs) => {
        const controller = HoverIntentUtils.create(visibility, defs);
        $effect(() => {
            const isShown = visibility[0]();
            untrack(() => controller.reportShown(isShown));
        });
        $effect(() => controller.stop);
        $effect(() => {
            const anchorRef = getAnchorRef();
            if (!anchorRef)
                return;
            return untrack(() => controller.observeAnchor(anchorRef));
        });
        $effect(() => {
            const panelRef = defs.getPanelRef();
            if (!panelRef)
                return;
            return untrack(() => controller.observePanel(panelRef));
        });
        return { getIsPointerInside: controller.getIsPointerInside, cancel: controller.cancel };
    };
})(HoverIntentSvelteUtils || (HoverIntentSvelteUtils = {}));
