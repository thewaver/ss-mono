import { useState } from "react";

import { type SelectionMode, SelectionUtils } from "@thewaver/ss-components";

import { useLatest } from "../../Utils/refUtils";
import { useStore } from "../../Utils/storeUtils";

/** The React side of `SelectionUtils`: the anchor of a run as state. The picking itself is framework-free. */
export namespace SelectionReactUtils {
    /**
     * Drives a selection from the gestures a control reports, remembering where a run should start.
     *
     * `SelectionUtils.create` reading this render's props at each gesture, with its anchor read as state.
     *
     * @param isDisabled Whether the control is off, in which case no gesture does anything.
     * @param defs.mode Whether nothing can be picked, one thing can, or many can.
     * @param defs.items The list, in the order it is drawn. An item that is not in it is ignored.
     * @param defs.selection What is selected now, and how to change it.
     * @returns `pick` for a gesture on one item, `selectAll` and `clear` for the two wholesale moves, and `anchor`
     * for where a run would currently start.
     */
    export const useSelection = <T>(
        isDisabled: boolean,
        defs: { mode: SelectionMode; items: T[]; selection: [T[], (next: T[]) => void] },
    ) => {
        const latest = useLatest({ isDisabled, ...defs });

        const [controller] = useState(() =>
            SelectionUtils.create<T>(() => latest.current.isDisabled, {
                getMode: () => latest.current.mode,
                getItems: () => latest.current.items,
                selection: [() => latest.current.selection[0], (next) => latest.current.selection[1](next)],
            }),
        );

        return {
            anchor: useStore(controller),
            pick: controller.pick,
            selectAll: controller.selectAll,
            clear: controller.clear,
        };
    };
}
