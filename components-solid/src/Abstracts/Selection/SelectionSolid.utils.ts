import { type SelectionDefs, type SelectionHandle, SelectionUtils } from "@thewaver/ss-components";

import { accessStore } from "../../Utils/storeUtils";

/** The Solid side of {@link SelectionUtils}: the anchor of a run as a signal. The picking itself is framework-free. */
export namespace SelectionSolidUtils {
    /**
     * Drives a selection from the gestures a control reports, remembering where a run should start.
     *
     * {@link SelectionUtils.create} with its anchor read as an accessor.
     *
     * Must run inside a component or another reactive owner.
     *
     * @param getIsDisabled Whether the control is off, in which case no gesture does anything.
     * @param defs What {@link SelectionUtils.create} takes.
     * @returns `pick` for a gesture on one item, `selectAll` and `clear` for the two wholesale moves,
     * and `getAnchor` for where a run would currently start.
     */
    export const create = <T>(getIsDisabled: () => boolean, defs: SelectionDefs<T>): SelectionHandle<T> => {
        const controller = SelectionUtils.create(getIsDisabled, defs);

        return {
            getAnchor: accessStore(controller),
            pick: controller.pick,
            selectAll: controller.selectAll,
            clear: controller.clear,
        };
    };
}
