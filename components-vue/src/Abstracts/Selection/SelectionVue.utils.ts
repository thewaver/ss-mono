import { type MaybeRefOrGetter, type Ref, toValue } from "vue";

import { type SelectionMode, SelectionUtils } from "@thewaver/ss-components";

import { useStore } from "../../Utils/storeUtils";

/** The Vue side of `SelectionUtils`: the anchor of a run as a ref. The picking itself is framework-free. */
export namespace SelectionVueUtils {
    /**
     * Drives a selection from the gestures a control reports, remembering where a run should start.
     *
     * `SelectionUtils.create` reading the current mode, items and selection at each gesture, with its anchor read as
     * a ref.
     *
     * Must run inside a component's `setup` or another effect scope.
     *
     * @param isDisabled Whether the control is off, in which case no gesture does anything.
     * @param defs.mode Whether nothing can be picked, one thing can, or many can.
     * @param defs.items The list, in the order it is drawn. An item that is not in it is ignored.
     * @param defs.selection What is selected now, read and written.
     * @returns `pick` for a gesture on one item, `selectAll` and `clear` for the two wholesale moves, and `anchor`, a
     * ref of where a run would currently start.
     */
    export const useSelection = <T>(
        isDisabled: MaybeRefOrGetter<boolean>,
        defs: { mode: MaybeRefOrGetter<SelectionMode>; items: MaybeRefOrGetter<T[]>; selection: Ref<T[]> },
    ) => {
        const controller = SelectionUtils.create<T>(() => toValue(isDisabled), {
            getMode: () => toValue(defs.mode),
            getItems: () => toValue(defs.items),
            selection: [
                () => defs.selection.value,
                (next) => {
                    defs.selection.value = next;
                },
            ],
        });

        return {
            anchor: useStore(controller),
            pick: controller.pick,
            selectAll: controller.selectAll,
            clear: controller.clear,
        };
    };
}
