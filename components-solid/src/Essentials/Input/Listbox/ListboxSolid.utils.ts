import { createEffect, createMemo, on, onCleanup, untrack } from "solid-js";

import {
    FlattenerUtils,
    LISTBOX_DEFAULTS,
    type ListboxCursorDefs,
    ListboxUtils,
    type SelectOptionFlags,
    SelectUtils,
} from "@thewaver/ss-components";

import type { InteractionTooltipDefs } from "../../../Primitives/InteractionWrapper/InteractionWrapperSolid.types";
import { accessStore } from "../../../Utils/storeUtils";
import type { ListboxCursor } from "./ListboxSolid.types";

/** The Solid side of {@link ListboxUtils}: the cursor's state read as accessors, and its effects run by Solid. */
export namespace ListboxSolidUtils {
    /**
     * Holds what a list of options needs between keystrokes: which option is highlighted, which ones can be reached,
     * and how a key moves or picks.
     *
     * {@link ListboxUtils.createCursor} with its state read as accessors, the rows and the highlight derived as memos,
     * and the two things that hang off state rather than off a key: closing the list clears the highlight, whatever
     * closed it, and under `"roving"` a highlight that moves while focus is inside the list takes focus with it.
     *
     * It must be called inside a component, since it owns signals, a typeahead buffer and effects.
     *
     * @param opts What {@link ListboxUtils.createCursor} takes.
     * @returns The cursor: the rows to draw, the highlight, the ids, and `handleKeyDown` for whichever element holds
     * focus. `highlight` and `pick` report whether they changed anything.
     */
    export const createCursor = <T>(
        opts: ListboxCursorDefs<T, InteractionTooltipDefs<SelectOptionFlags>>,
    ): ListboxCursor<T> => {
        const controller = ListboxUtils.createCursor(opts);

        onCleanup(controller.clear);

        const getHighlightedValue = accessStore(controller, (state) => state.highlightedValue);
        const getHasFocus = accessStore(controller, (state) => state.hasFocus);
        const getHighlightRequests = accessStore(controller, (state) => state.highlightRequests);

        const getIsOpen = () => opts.getIsOpen?.() ?? true;
        const isRoving = opts.focusModel === "roving";

        const getOrientation = createMemo(() => opts.getOrientation?.() ?? LISTBOX_DEFAULTS.orientation);

        const getOptions = createMemo(() => opts.getOptions());

        const getItemRows = createMemo(() => SelectUtils.getItemRows(getOptions()));

        const getFlatOptions = createMemo(() => SelectUtils.getFlatOptions(getOptions()));

        const getRows = createMemo(() => FlattenerUtils.getFlatRows(getItemRows()));

        const getNavigableIndexes = createMemo(() => ListboxUtils.getNavigableIndexes(getFlatOptions()));

        const getHighlightedIndex = createMemo(() =>
            ListboxUtils.computeHighlightedIndex({
                options: getFlatOptions(),
                navigable: getNavigableIndexes(),
                highlightedValue: getHighlightedValue(),
                selectedValue: opts.getSelectedOptions()[0]?.value,
                isHighlightExplicit: opts.isHighlightExplicit ?? false,
                isFiltering: opts.getIsFiltering?.() ?? false,
            }),
        );

        const getIsHighlightShown = createMemo(() => !isRoving || getHasFocus());

        const getOptionId = (index: number) => ListboxUtils.getOptionId(opts.getListboxId(), index);

        const getActiveOptionId = createMemo(() =>
            ListboxUtils.computeActiveOptionId(opts.getListboxId(), getHighlightedIndex(), {
                focusModel: opts.focusModel,
                isOpen: getIsOpen(),
            }),
        );

        createEffect(() => {
            if (getIsOpen()) return;

            controller.highlight(undefined);
        });

        if (isRoving) {
            createEffect(
                on(getHighlightedIndex, (index) => {
                    if (index === undefined || !untrack(getHasFocus)) return;

                    ListboxUtils.focusOption(opts.getListboxId(), index);
                }),
            );
        }

        return {
            focusModel: opts.focusModel,
            getListboxId: opts.getListboxId,
            getOrientation,
            getOptions,
            getItemRows,
            getRows,
            getFlatOptions,
            getHighlightedIndex,
            getIsHighlightShown,
            getHighlightRequests,
            getActiveOptionId,
            getOptionId,
            setHasFocus: controller.setHasFocus,
            highlight: controller.highlight,
            pick: controller.pick,
            handleKeyDown: controller.handleKeyDown,
        };
    };
}
