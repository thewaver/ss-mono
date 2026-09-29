import { type ListboxCursorDefs } from "@thewaver/ss-components";
import type { SelectOptionTooltipDefs } from "../Select/Select.types.js";
import type { ListboxCursor } from "./Listbox.types.js";
/** The Svelte side of {@link ListboxUtils}: the cursor's state read as getters, and its effects run by runes. */
export declare namespace ListboxSvelteUtils {
    /**
     * Holds what a list of options needs between keystrokes: which option is highlighted, which ones can be reached,
     * and how a key moves or picks.
     *
     * {@link ListboxUtils.createCursor} with its state read as getters, the rows and the highlight derived, and the
     * two things that hang off state rather than off a key: closing the list clears the highlight, whatever closed
     * it, and under `"roving"` a highlight that moves while focus is inside the list takes focus with it. A pending
     * typeahead query is dropped when the component is destroyed.
     *
     * Must run while a component is being set up.
     *
     * @param defs What {@link ListboxUtils.createCursor} takes. `focusModel` and `isHighlightExplicit` are read once,
     * when the cursor is made; the getters are read reactively, so they may read the component's props.
     * @returns The cursor: the rows to draw, the highlight, the ids, and `handleKeyDown` for whichever element holds
     * focus. `highlight` and `pick` report whether they changed anything.
     */
    const createCursor: <T>(defs: ListboxCursorDefs<T, SelectOptionTooltipDefs>) => ListboxCursor<T>;
}
