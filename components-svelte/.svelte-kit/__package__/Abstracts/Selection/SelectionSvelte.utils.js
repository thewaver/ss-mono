import { SelectionUtils } from "@thewaver/ss-components";
import { readStore } from "../../Utils/storeUtils.js";
/** The Svelte side of {@link SelectionUtils}: the anchor of a run as a getter. The picking itself is framework-free. */
export var SelectionSvelteUtils;
(function (SelectionSvelteUtils) {
    /**
     * Drives a selection from the gestures a control reports, remembering where a run should start.
     *
     * {@link SelectionUtils.create} with its anchor read as a getter. The definitions are read at each gesture, so
     * functions reading the component's props always see the current ones.
     *
     * @param getIsDisabled Whether the control is off, in which case no gesture does anything.
     * @param defs What {@link SelectionUtils.create} takes.
     * @returns `pick` for a gesture on one item, `selectAll` and `clear` for the two wholesale moves, and `getAnchor`
     * for where a run would currently start.
     */
    SelectionSvelteUtils.create = (getIsDisabled, defs) => {
        const controller = SelectionUtils.create(getIsDisabled, defs);
        return {
            getAnchor: readStore(controller),
            pick: controller.pick,
            selectAll: controller.selectAll,
            clear: controller.clear,
        };
    };
})(SelectionSvelteUtils || (SelectionSvelteUtils = {}));
