import { untrack } from "svelte";

import {
    FlattenerUtils,
    LISTBOX_DEFAULTS,
    type ListboxCursorDefs,
    ListboxUtils,
    SelectUtils,
} from "@thewaver/ss-components";

import { readStore } from "../../../Utils/storeUtils.js";
import type { SelectOptionTooltipDefs } from "../Select/Select.types.js";
import type { ListboxCursor } from "./Listbox.types.js";

/** The Svelte side of {@link ListboxUtils}: the cursor's state read as getters, and its effects run by runes. */
export namespace ListboxSvelteUtils {
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
    export const createCursor = <T>(defs: ListboxCursorDefs<T, SelectOptionTooltipDefs>): ListboxCursor<T> => {
        const controller = ListboxUtils.createCursor(defs);

        $effect(() => controller.clear);

        const getHighlightedValue = readStore(controller, (state) => state.highlightedValue);
        const getHasFocus = readStore(controller, (state) => state.hasFocus);
        const getHighlightRequests = readStore(controller, (state) => state.highlightRequests);

        const isRoving = defs.focusModel === "roving";

        const isOpen = $derived(defs.getIsOpen?.() ?? true);
        const orientation = $derived(defs.getOrientation?.() ?? LISTBOX_DEFAULTS.orientation);
        const options = $derived(defs.getOptions());
        const itemRows = $derived(SelectUtils.getItemRows(options));
        const flatOptions = $derived(SelectUtils.getFlatOptions(options));
        const rows = $derived(FlattenerUtils.getFlatRows(itemRows));
        const navigable = $derived(ListboxUtils.getNavigableIndexes(flatOptions));

        const highlightedIndex = $derived(
            ListboxUtils.computeHighlightedIndex({
                options: flatOptions,
                navigable,
                highlightedValue: getHighlightedValue(),
                selectedValue: defs.getSelectedOptions()[0]?.value,
                isHighlightExplicit: defs.isHighlightExplicit ?? false,
                isFiltering: defs.getIsFiltering?.() ?? false,
            }),
        );

        const isHighlightShown = $derived(!isRoving || getHasFocus());

        const activeOptionId = $derived(
            ListboxUtils.computeActiveOptionId(defs.getListboxId(), highlightedIndex, {
                focusModel: defs.focusModel,
                isOpen,
            }),
        );

        $effect(() => {
            if (isOpen) return;

            untrack(() => controller.highlight(undefined));
        });

        $effect(() => {
            const index = highlightedIndex;

            if (!isRoving || index === undefined) return;

            untrack(() => {
                if (!getHasFocus()) return;

                ListboxUtils.focusOption(defs.getListboxId(), index);
            });
        });

        return {
            focusModel: defs.focusModel,
            getListboxId: defs.getListboxId,
            getOrientation: () => orientation,
            getOptions: () => options,
            getItemRows: () => itemRows,
            getRows: () => rows,
            getFlatOptions: () => flatOptions,
            getHighlightedIndex: () => highlightedIndex,
            getIsHighlightShown: () => isHighlightShown,
            getHighlightRequests,
            getActiveOptionId: () => activeOptionId,
            getOptionId: (index) => ListboxUtils.getOptionId(defs.getListboxId(), index),
            setHasFocus: controller.setHasFocus,
            highlight: controller.highlight,
            pick: controller.pick,
            handleKeyDown: controller.handleKeyDown,
        };
    };
}
