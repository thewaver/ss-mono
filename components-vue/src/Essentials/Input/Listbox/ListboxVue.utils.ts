import { computed, onScopeDispose, toValue } from "vue";

import { FlattenerUtils, LISTBOX_DEFAULTS, ListboxUtils, SelectUtils } from "@thewaver/ss-components";

import { watchAfterRender } from "../../../Utils/effectUtils";
import { useStore } from "../../../Utils/storeUtils";
import type { SelectOptionTooltipDefs } from "../Select/Select.types";
import type { ListboxCursor, ListboxCursorOpts } from "./Listbox.types";

/** The Vue side of `ListboxUtils`: the cursor's state read as refs, and its effects run by Vue. */
export namespace ListboxVueUtils {
    /**
     * Holds what a list of options needs between keystrokes: which option is highlighted, which ones can be reached,
     * and how a key moves or picks.
     *
     * `ListboxUtils.createCursor`, made once and reading the options through the getters it is handed, with the rows
     * and the highlight worked out as computed refs, and the two things that hang off state rather than off a key:
     * closing the list clears the highlight, whatever closed it, and under `"roving"` a highlight that moves while
     * focus is inside the list takes focus with it. A pending typeahead query is dropped when the component unmounts.
     *
     * Must run inside a component's `setup`.
     *
     * @param opts What `ListboxUtils.createCursor` takes, with refs or getters in place of its getters. `focusModel`
     * and `isHighlightExplicit` are read once, when the cursor is made. Callbacks are called when the moment comes, so
     * a caller writes them to read the current prop then; `getComputeCustomText` hands over the function the
     * typeahead reads, whose presence is read at each keystroke.
     * @returns The cursor: computed refs of the rows to draw, the highlight and the ids, and `handleKeyDown`, which
     * takes the native event, for whichever element holds focus. `highlight` and `pick` report whether they changed
     * anything.
     */
    export const useCursor = <T>(opts: ListboxCursorOpts<T>): ListboxCursor<T> => {
        const controller = ListboxUtils.createCursor<T, SelectOptionTooltipDefs>({
            focusModel: opts.focusModel,
            isHighlightExplicit: opts.isHighlightExplicit,
            getListboxId: () => toValue(opts.listboxId),
            getOptions: () => toValue(opts.options),
            getSelectedOptions: () => toValue(opts.selectedOptions),
            getIsDisabled: () => toValue(opts.isDisabled),
            getIsMultiple: () => toValue(opts.isMultiple) ?? false,
            getIsOpen: () => toValue(opts.isOpen) ?? true,
            getIsFilterable: () => toValue(opts.isFilterable) ?? false,
            getIsFiltering: () => toValue(opts.isFiltering) ?? false,
            getHasMoreOptions: () => toValue(opts.hasMoreOptions) ?? false,
            getOrientation: () => toValue(opts.orientation) ?? LISTBOX_DEFAULTS.orientation,
            getDirection: () => toValue(opts.direction),
            get computeCustomText() {
                return opts.getComputeCustomText?.();
            },
            onOpen: () => opts.onOpen?.(),
            onClose: () => opts.onClose?.(),
            onPick: (value) => opts.onPick(value),
        });

        onScopeDispose(controller.clear);

        const highlightedValue = useStore(controller, (state) => state.highlightedValue);
        const hasFocus = useStore(controller, (state) => state.hasFocus);
        const highlightRequests = useStore(controller, (state) => state.highlightRequests);

        const isRoving = opts.focusModel === "roving";

        const listboxId = computed(() => toValue(opts.listboxId));
        const isOpen = computed(() => toValue(opts.isOpen) ?? true);
        const orientation = computed(() => toValue(opts.orientation) ?? LISTBOX_DEFAULTS.orientation);
        const options = computed(() => toValue(opts.options));
        const itemRows = computed(() => SelectUtils.getItemRows(options.value));
        const flatOptions = computed(() => SelectUtils.getFlatOptions(options.value));
        const rows = computed(() => FlattenerUtils.getFlatRows(itemRows.value));
        const navigable = computed(() => ListboxUtils.getNavigableIndexes(flatOptions.value));

        const highlightedIndex = computed(() =>
            ListboxUtils.computeHighlightedIndex({
                options: flatOptions.value,
                navigable: navigable.value,
                highlightedValue: highlightedValue.value,
                selectedValue: toValue(opts.selectedOptions)[0]?.value,
                isHighlightExplicit: opts.isHighlightExplicit ?? false,
                isFiltering: toValue(opts.isFiltering) ?? false,
            }),
        );

        watchAfterRender([isOpen], ([isShown]) => {
            if (isShown) return;

            controller.highlight(undefined);
        });

        watchAfterRender([highlightedIndex], ([index]) => {
            if (!isRoving || index === undefined || !controller.get().hasFocus) return;

            ListboxUtils.focusOption(listboxId.value, index);
        });

        return {
            focusModel: opts.focusModel,
            listboxId,
            orientation,
            options,
            itemRows,
            rows,
            flatOptions,
            highlightedIndex,
            isHighlightShown: computed(() => !isRoving || hasFocus.value),
            highlightRequests,
            activeOptionId: computed(() =>
                ListboxUtils.computeActiveOptionId(listboxId.value, highlightedIndex.value, {
                    focusModel: opts.focusModel,
                    isOpen: isOpen.value,
                }),
            ),
            getOptionId: (index) => ListboxUtils.getOptionId(listboxId.value, index),
            setHasFocus: controller.setHasFocus,
            highlight: controller.highlight,
            pick: controller.pick,
            handleKeyDown: controller.handleKeyDown,
        };
    };
}
