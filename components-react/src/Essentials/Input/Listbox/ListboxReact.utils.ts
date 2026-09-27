import { useEffect, useLayoutEffect, useMemo, useState } from "react";

import { FlattenerUtils, LISTBOX_DEFAULTS, ListboxUtils, SelectUtils } from "@thewaver/ss-components";

import { useLatest } from "../../../Utils/refUtils";
import { useStore } from "../../../Utils/storeUtils";
import type { SelectOptionTooltipDefs } from "../Select/Select.types";
import type { ListboxCursor, ListboxCursorOpts } from "./Listbox.types";

/** The React side of `ListboxUtils`: the cursor's state read as React state, and its effects run by React. */
export namespace ListboxReactUtils {
    /**
     * Holds what a list of options needs between keystrokes: which option is highlighted, which ones can be reached,
     * and how a key moves or picks.
     *
     * `ListboxUtils.createCursor`, made once and reading this render's options through a ref, with the rows and the
     * highlight worked out during rendering, and the two things that hang off state rather than off a key: closing
     * the list clears the highlight, whatever closed it, and under `"roving"` a highlight that moves while focus is
     * inside the list takes focus with it. A pending typeahead query is dropped on unmount.
     *
     * @param opts What `ListboxUtils.createCursor` takes, as this render's values rather than getters. `focusModel`
     * and `isHighlightExplicit` are read once, when the cursor is made.
     * @returns The cursor: the rows to draw, the highlight, the ids, and `handleKeyDown`, which takes the native event,
     * for whichever element holds focus. `highlight` and `pick` report whether they changed anything.
     */
    export const useCursor = <T>(opts: ListboxCursorOpts<T>): ListboxCursor<T> => {
        const latest = useLatest(opts);

        const [controller] = useState(() =>
            ListboxUtils.createCursor<T, SelectOptionTooltipDefs>({
                focusModel: opts.focusModel,
                isHighlightExplicit: opts.isHighlightExplicit,
                getListboxId: () => latest.current.listboxId,
                getOptions: () => latest.current.options,
                getSelectedOptions: () => latest.current.selectedOptions,
                getIsDisabled: () => latest.current.isDisabled,
                getIsMultiple: () => latest.current.isMultiple ?? false,
                getIsOpen: () => latest.current.isOpen ?? true,
                getIsFilterable: () => latest.current.isFilterable ?? false,
                getIsFiltering: () => latest.current.isFiltering ?? false,
                getHasMoreOptions: () => latest.current.hasMoreOptions ?? false,
                getOrientation: () => latest.current.orientation ?? LISTBOX_DEFAULTS.orientation,
                getDirection: () => latest.current.direction,
                get computeCustomText() {
                    return latest.current.computeCustomText;
                },
                onOpen: () => latest.current.onOpen?.(),
                onClose: () => latest.current.onClose?.(),
                onPick: (value) => latest.current.onPick(value),
            }),
        );

        useEffect(() => controller.clear, [controller]);

        const highlightedValue = useStore(controller, (state) => state.highlightedValue);
        const hasFocus = useStore(controller, (state) => state.hasFocus);

        const isOpen = opts.isOpen ?? true;
        const isRoving = opts.focusModel === "roving";

        const itemRows = useMemo(() => SelectUtils.getItemRows(opts.options), [opts.options]);
        const flatOptions = useMemo(() => SelectUtils.getFlatOptions(opts.options), [opts.options]);
        const rows = useMemo(() => FlattenerUtils.getFlatRows(itemRows), [itemRows]);
        const navigable = useMemo(() => ListboxUtils.getNavigableIndexes(flatOptions), [flatOptions]);

        const highlightedIndex = ListboxUtils.computeHighlightedIndex({
            options: flatOptions,
            navigable,
            highlightedValue,
            selectedValue: opts.selectedOptions[0]?.value,
            isHighlightExplicit: opts.isHighlightExplicit ?? false,
            isFiltering: opts.isFiltering ?? false,
        });

        useEffect(() => {
            if (isOpen) return;

            controller.highlight(undefined);
        }, [isOpen, controller]);

        useLayoutEffect(() => {
            if (!isRoving || highlightedIndex === undefined || !controller.get().hasFocus) return;

            ListboxUtils.focusOption(latest.current.listboxId, highlightedIndex);
        }, [isRoving, highlightedIndex, controller, latest]);

        return {
            focusModel: opts.focusModel,
            listboxId: opts.listboxId,
            orientation: opts.orientation ?? LISTBOX_DEFAULTS.orientation,
            options: opts.options,
            itemRows,
            rows,
            flatOptions,
            highlightedIndex,
            isHighlightShown: !isRoving || hasFocus,
            activeOptionId: ListboxUtils.computeActiveOptionId(opts.listboxId, highlightedIndex, {
                focusModel: opts.focusModel,
                isOpen,
            }),
            getOptionId: (index) => ListboxUtils.getOptionId(opts.listboxId, index),
            setHasFocus: controller.setHasFocus,
            highlight: controller.highlight,
            pick: controller.pick,
            handleKeyDown: controller.handleKeyDown,
        };
    };
}
