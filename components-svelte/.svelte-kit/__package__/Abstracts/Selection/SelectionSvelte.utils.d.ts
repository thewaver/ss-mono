import { type SelectionDefs, type SelectionHandle } from "@thewaver/ss-components";
/** The Svelte side of {@link SelectionUtils}: the anchor of a run as a getter. The picking itself is framework-free. */
export declare namespace SelectionSvelteUtils {
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
    const create: <T>(getIsDisabled: () => boolean, defs: SelectionDefs<T>) => SelectionHandle<T>;
}
