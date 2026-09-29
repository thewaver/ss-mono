import { StoreUtils } from "@thewaver/ss-utils";

import { CheckedStateUtils } from "../../../Abstracts/CheckedState/CheckedState.utils";
import { FlattenerUtils } from "../../../Abstracts/Flattener/Flattener.utils";
import { InteractionTrackerUtils } from "../../../Abstracts/InteractionTracker/InteractionTracker.utils";
import type { NavigatorDirection } from "../../../Abstracts/Navigator/Navigator.types";
import { NavigatorUtils } from "../../../Abstracts/Navigator/Navigator.utils";
import { TypeaheadUtils } from "../../../Abstracts/Typeahead/Typeahead.utils";
import type { VirtualizerRow } from "../../../Abstracts/Virtualizer/Virtualizer.types";
import { PopoverUtils } from "../../../Primitives/Popover/Popover.utils";
import type { SelectGroupFlags } from "../Select/Select.types";
import type {
    SelectOptionRecord as SelectOption,
    SelectOptionGroupRecord as SelectOptionGroup,
    SelectRowRecord as SelectRow,
} from "../Select/Select.types";
import { SelectUtils } from "../Select/Select.utils";
import { LISTBOX_DEFAULTS } from "./Listbox.const";
import type {
    ListboxComboboxAttributes,
    ListboxCursorController,
    ListboxCursorDefs,
    ListboxCursorState,
    ListboxFocusModel,
    ListboxOrientation,
    ListboxReachEndGuard,
    ListboxWindowedRun,
} from "./Listbox.types";

/** The element a list of options is drawn in, which for a popup's list is the popup's own root. */
const LISTBOX_SELECTOR = '[role="listbox"]';

/** Jumps to the first option, and is not a step, so it never counts as wrapping round. */
const FIRST_KEY = "Home";
/** Jumps to the last option, for the same reason. */
const LAST_KEY = "End";
/** The middle of a three-item probe list, from which a forward key lands on the last item and a backward one on the first. */
const PROBE_FROM = 1;
/** How long the probe list is. */
const PROBE_LENGTH = 3;
/** Where a backward key lands in the probe list. */
const PROBE_BACKWARD = 0;
/** No rows to hold in the window. */
const NO_PINNED_ROWS: number[] = [];

/**
 * Where to walk from when nothing is highlighted, so the first forward key lands on the first option and the first
 * backward key on the last, rather than one past either.
 */
const computeUnplacedFrom = (
    key: string,
    length: number,
    opts: { orientation: ListboxOrientation; direction: NavigatorDirection | undefined; hasEdgeKeys: boolean },
) => (NavigatorUtils.computeNextPosition(key, PROBE_FROM, PROBE_LENGTH, opts) === PROBE_BACKWARD ? length : -1);

/** The state behind a list of options that the reader walks, types into and picks from. */
export namespace ListboxUtils {
    /**
     * Which options the keyboard walk can land on, by their place in the flat list.
     *
     * An enabled option is always reachable. A disabled one is reachable only when it is kept reachable, which is how
     * a disabled option with a tooltip explaining why stays where a reader can find it; a pick still refuses it.
     *
     * @param options Every option, with the groups dissolved, as {@link SelectUtils.getFlatOptions} gives them.
     * @returns The indexes the walk steps between, in order.
     */
    export const getNavigableIndexes = <T, D>(options: SelectOption<T, D>[]) =>
        options.reduce<number[]>((acc, option, index) => {
            const isReachable = InteractionTrackerUtils.computeIsReachable(
                option.isDisabled ?? false,
                option.isReachableWhenDisabled ?? false,
            );

            if (!option.isDisabled || isReachable) acc.push(index);

            return acc;
        }, []);

    /**
     * Which option is highlighted, given what was last moved to.
     *
     * The highlight is held as a value rather than an index, so a list that changes underneath it keeps pointing at
     * the same option. When that value is not among the reachable options — nothing has been moved to yet, or the
     * option has left the list — it falls back to the first picked option, unless the list is being filtered, where
     * the first option wins so Enter does not re-pick the old value; then to the first reachable option. An explicit
     * highlight has no fallback at all, so nothing is highlighted until the reader moves there.
     *
     * @param opts.options Every option, with the groups dissolved.
     * @param opts.navigable The reachable indexes, from {@link getNavigableIndexes}.
     * @param opts.highlightedValue The value last moved to, if any.
     * @param opts.selectedValue The first picked value, if any.
     * @param opts.isHighlightExplicit Whether the highlight falls back to nothing rather than to an option.
     * @param opts.isFiltering Whether the list is being narrowed right now.
     * @returns The highlighted option's flat index, or `undefined` when nothing is highlighted.
     */
    export const computeHighlightedIndex = <T, D>(opts: {
        options: SelectOption<T, D>[];
        navigable: number[];
        highlightedValue: T | undefined;
        selectedValue: T | undefined;
        isHighlightExplicit: boolean;
        isFiltering: boolean;
    }) => {
        const highlightedIndex = opts.navigable.find((index) => opts.options[index].value === opts.highlightedValue);

        if (highlightedIndex !== undefined || opts.isHighlightExplicit) return highlightedIndex;

        const selectedIndex = opts.navigable.find((index) => opts.options[index].value === opts.selectedValue);

        if (!opts.isFiltering && selectedIndex !== undefined) return selectedIndex;

        return opts.navigable[0];
    };

    /**
     * The id an option's element carries.
     *
     * @param listboxId The id of the element carrying `role="listbox"`.
     * @param index The option's flat index.
     */
    export const getOptionId = (listboxId: string, index: number) => `${listboxId}-option-${index}`;

    /**
     * The id a field's `aria-activedescendant` points at, which is how a reader hears the highlight move while focus
     * stays on the field.
     *
     * @param listboxId The id of the element carrying `role="listbox"`.
     * @param highlightedIndex The highlighted option's flat index, if any.
     * @param opts.focusModel Where focus sits. A list whose options take focus themselves has no active descendant.
     * @param opts.isOpen Whether the options are on screen. A closed list points at nothing.
     * @returns The option's id, or `undefined` when there is nothing to point at.
     */
    export const computeActiveOptionId = (
        listboxId: string,
        highlightedIndex: number | undefined,
        opts: { focusModel: ListboxFocusModel; isOpen: boolean },
    ) => {
        if (opts.focusModel === "roving" || !opts.isOpen || highlightedIndex === undefined) return;

        return getOptionId(listboxId, highlightedIndex);
    };

    /**
     * The text an option is found by when the reader types.
     *
     * The consumer's own text wins. Otherwise it is the option's text as a screen reader would read it, off the
     * element the library draws it in; and where there is no element — an option out of view in a windowed list — or
     * the element has no text, it is the value written out as text, so a windowed list of plain strings still answers
     * typing.
     *
     * @param listboxId The id of the element carrying `role="listbox"`.
     * @param index The option's flat index.
     * @param option The option.
     * @param computeCustomText The consumer's own text for an option, if any.
     */
    export const computeOptionText = <T, D>(
        listboxId: string,
        index: number,
        option: SelectOption<T, D>,
        computeCustomText?: (option: SelectOption<T, D>) => string,
    ) => {
        const custom = computeCustomText?.(option);

        if (custom !== undefined) return custom;

        const painted = TypeaheadUtils.getElementText(document.getElementById(getOptionId(listboxId, index)));

        return painted.length > 0 ? painted : String(option.value);
    };

    /**
     * The text a picked suggestion writes into a text field.
     *
     * The consumer's own text wins; otherwise it is the option's text as a screen reader would read it, taken from the
     * element the library draws it in, so anything the painter marked `aria-hidden` stays out of the field.
     *
     * @param listboxId The id of the element carrying `role="listbox"`.
     * @param index The suggestion's flat index.
     * @param customText The consumer's own text, if they gave one.
     */
    export const computePickedText = (listboxId: string, index: number, customText: string | undefined) =>
        customText ?? TypeaheadUtils.getElementText(document.getElementById(getOptionId(listboxId, index))).trim();

    /**
     * Moves focus to an option, for a list whose options take focus themselves.
     *
     * Nothing happens when the option is not in the document or already has focus. The page is not scrolled by the
     * move, because the list scrolls its own highlighted option into view.
     *
     * @param listboxId The id of the element carrying `role="listbox"`.
     * @param index The option's flat index.
     */
    export const focusOption = (listboxId: string, index: number) => {
        const element = document.getElementById(getOptionId(listboxId, index));

        if (!element || element === document.activeElement) return;

        element.focus({ preventScroll: true });
    };

    /**
     * Scrolls the highlighted option into view, moving the page only when the option is what holds focus.
     *
     * Under `"activeDescendant"` focus stays in the field and the list is that field's popup, whose root carries
     * `role="listbox"`. An option is highlighted the moment the popup opens, while it is still unplaced, so only the
     * scrollers between the option and that root move, through {@link PopoverUtils.revealWithin}, and a page with no
     * `Viewport` never jumps. Under `"roving"` the option is itself the focused element, drawn in the page among the
     * consumer's own scrollers, and {@link focusOption} moves focus without scrolling — so the option is brought into
     * view the way focus brings anything into view, through every scroller the page included.
     *
     * @param option The option's element.
     * @param focusModel Where focus sits while the list is used, from the list's cursor.
     */
    export const revealOption = (option: HTMLElement, focusModel: ListboxFocusModel) => {
        if (focusModel === "roving") {
            option.scrollIntoView({ block: "nearest" });

            return;
        }

        const list = option.closest<HTMLElement>(LISTBOX_SELECTOR);

        if (list) PopoverUtils.revealWithin(option, list);
    };

    /**
     * The combobox attributes a field carries when it opens a list of options.
     *
     * The list is pointed at only while it is open, since a closed one is not in the document; the highlighted option
     * is announced through the field, because focus never leaves it.
     *
     * @param opts.isOpen Whether the list is open.
     * @param opts.listboxId The id of the element carrying `role="listbox"`.
     * @param opts.activeOptionId The highlighted option's id, from {@link computeActiveOptionId}.
     * @param opts.isEditable Whether the field is typed into, which announces that the list completes what is typed.
     * @returns The attributes, to spread onto the field.
     */
    export const computeComboboxAttributes = (opts: {
        isOpen: boolean;
        listboxId: string;
        activeOptionId: string | undefined;
        isEditable: boolean;
    }): ListboxComboboxAttributes => ({
        "role": "combobox",
        "aria-haspopup": "listbox",
        "aria-autocomplete": opts.isEditable ? "list" : undefined,
        "aria-expanded": opts.isOpen,
        "aria-controls": opts.isOpen ? opts.listboxId : undefined,
        "aria-activedescendant": opts.activeOptionId,
    });

    /**
     * What a group heading is told about how much of its group is picked.
     *
     * @param group The group.
     * @param computeIsSelected Whether a value counts as picked.
     * @returns The group's flags: `true` when every option is picked, `false` when none is, `"mixed"` in between.
     */
    export const computeGroupFlags = <T, D>(
        group: SelectOptionGroup<T, D>,
        computeIsSelected: (value: T) => boolean,
    ): SelectGroupFlags => ({
        checkedState: CheckedStateUtils.fromMembers(group.options.map((option) => computeIsSelected(option.value))),
    });

    /**
     * How tall a row is guessed to be before it is drawn, for a list that mounts only the rows on screen.
     *
     * A group heading is asked about by its group's written position, and falls back to the option guess when no
     * heading guess is given, since a wrong guess only shifts the scrollbar until the row is measured.
     *
     * @param row The row, if it exists.
     * @param computeEstimatedOptionHeight The consumer's guess for an option, by its flat index.
     * @param computeEstimatedGroupHeight The consumer's guess for a group heading, by its written position.
     * @returns The guess, or `0` with nothing to go on.
     */
    export const computeEstimatedRowSize = <T, D>(
        row: SelectRow<T, D> | undefined,
        computeEstimatedOptionHeight: ((index: number) => number) | undefined,
        computeEstimatedGroupHeight: ((index: number) => number) | undefined,
    ) =>
        row?.isEntry !== true
            ? (computeEstimatedGroupHeight?.(row?.position ?? 0) ?? computeEstimatedOptionHeight?.(0) ?? 0)
            : (computeEstimatedOptionHeight?.(row.entryOffset) ?? 0);

    /**
     * Which row carries the highlighted option.
     *
     * @param rows Every row, from {@link SelectUtils.getItemRows} flattened.
     * @param highlightedIndex The highlighted option's flat index, if any.
     * @returns The row's index, or `undefined` when nothing is highlighted or the option is not among the rows.
     */
    export const getHighlightedRowIndex = <T, D>(rows: SelectRow<T, D>[], highlightedIndex: number | undefined) => {
        if (highlightedIndex === undefined) return;

        const rowIndex = FlattenerUtils.getEntryRowIndex(rows, highlightedIndex);

        return rowIndex === -1 ? undefined : rowIndex;
    };

    /**
     * The rows a windowed list keeps mounted wherever it is scrolled.
     *
     * The highlighted option's row, because the field names it through `aria-activedescendant` and a name pointing at
     * nothing announces nothing; and holding it mounted also holds its group's box.
     *
     * @param rows Every row.
     * @param highlightedIndex The highlighted option's flat index, if any.
     * @returns The row indexes to keep, which is none when nothing is highlighted.
     */
    export const getPinnedRows = <T, D>(rows: SelectRow<T, D>[], highlightedIndex: number | undefined) => {
        const rowIndex = getHighlightedRowIndex(rows, highlightedIndex);

        return rowIndex === undefined ? NO_PINNED_ROWS : [rowIndex];
    };

    /**
     * Cuts the rows a windowed list has mounted into runs of one group each.
     *
     * Consecutive rows sharing a group get one `role="group"` box, and a run starting halfway down a group is
     * ordinary: the box carries no paint, so wrapping only the part of a group on screen changes nothing a reader can
     * see, and its name travels on the box whether or not the heading row is in the window.
     *
     * @param windowRows The rows the window has mounted, in order.
     * @param rows Every row.
     * @returns The runs, each with its group's row index and the group itself, or neither for options outside any
     * group.
     */
    export const getWindowedRuns = <T, D>(windowRows: VirtualizerRow[], rows: SelectRow<T, D>[]) => {
        const runs: ListboxWindowedRun<T, D>[] = [];

        for (const row of windowRows) {
            const source = rows[row.index];
            const groupIndex = source === undefined ? undefined : SelectUtils.getGroupRowIndex(source);
            const last = runs[runs.length - 1];

            if (last && last.groupIndex === groupIndex) {
                last.rows.push(row);

                continue;
            }

            runs.push({
                groupIndex,
                group: groupIndex === undefined ? undefined : (rows[groupIndex].node as SelectOptionGroup<T, D>),
                rows: [row],
            });
        }

        return runs;
    };

    /**
     * Remembers which list of options the reader last reached the end of, so the consumer is asked for more once per
     * list rather than once per time the end comes into view.
     *
     * It holds the options array itself, not its length: a filtered list is replaced rather than appended to, so a new
     * query whose result is as long as the last would otherwise read as already asked, and never load.
     *
     * @returns `claim`, which answers whether a list is new and remembers it, and `reset`, for when the list goes
     * off screen.
     */
    export const createReachEndGuard = <TOptions>(): ListboxReachEndGuard<TOptions> => {
        let askedFor: TOptions | undefined;

        return {
            claim: (options) => {
                if (askedFor === options) return false;

                askedFor = options;

                return true;
            },
            reset: () => {
                askedFor = undefined;
            },
        };
    };

    /**
     * Holds what a list of options needs between keystrokes: which option is highlighted, whether focus is inside
     * the list, and how a key moves or picks.
     *
     * One cursor serves a list whose options are drawn inside a popup opened from a field and a list standing on its
     * own in the page. The difference between the two is `focusModel`, fixed by whoever creates the cursor. Under
     * `"activeDescendant"` focus stays on the field and the highlight is announced through the field; under
     * `"roving"` each option takes focus itself, the highlighted one is the list's single tab stop, and the binding
     * moves focus to the highlighted option while focus is inside the list.
     *
     * The highlight is held as a value and resolved to an index by {@link computeHighlightedIndex}. Pass
     * `isHighlightExplicit` for a list whose options only suggest, where nothing is highlighted until the reader moves
     * there, so Enter can still mean the text that was typed.
     *
     * Disabled options are skipped by the walk unless they are reachable while disabled, in which case the walk stops
     * on them and a pick refuses them. The cursor does not watch the open state: a binding clears the highlight with
     * `highlight(undefined)` whenever the list closes, whatever closed it.
     *
     * @param defs.focusModel Where focus sits while the reader walks the options.
     * @param defs.isHighlightExplicit Leaves nothing highlighted until the reader moves to an option.
     * @param defs.getListboxId The id of the element carrying `role="listbox"`. Every option's id is built from it.
     * @param defs.getOptions The options and groups, in the order they are shown.
     * @param defs.getSelectedOptions The options currently picked; the first is where the highlight falls back to.
     * @param defs.getIsDisabled Whether the list refuses every key.
     * @param defs.getIsMultiple Whether a pick keeps the list open and moves the highlight to what was picked. Left out,
     * a pick closes it.
     * @param defs.getIsOpen Whether the options are on screen. Left out, the list is always open.
     * @param defs.getIsFilterable Whether the keys go to an editable field first: Space types, Home and End move the
     * caret, and typing does not jump to a match.
     * @param defs.getIsFiltering Whether the list is being narrowed right now, so the highlight prefers the first
     * option over the picked one.
     * @param defs.getHasMoreOptions Whether more options are still to come, so an arrow at either end does not wrap
     * round past options that have not arrived.
     * @param defs.getOrientation Which arrows walk the list. Vertical when left out.
     * @param defs.getDirection The page's text direction, which decides which horizontal arrow moves forward.
     * @param defs.computeCustomText The text an option is found by when the reader types, as
     * {@link computeOptionText} takes it.
     * @param defs.onOpen Asked for when a key should open the list.
     * @param defs.onClose Asked for when a key or a pick should close it.
     * @param defs.onPick Told which value was picked.
     * @returns The cursor: a store of the highlighted value and whether focus is inside, `getHighlightedIndex`,
     * `handleKeyDown` for whichever element holds focus, and `clear` to drop a pending typeahead query when the owner
     * goes away. `highlight` and `pick` report whether they changed anything. The cursor stays usable after `clear`.
     */
    export const createCursor = <T, D>(defs: ListboxCursorDefs<T, D>): ListboxCursorController<T> => {
        const store = StoreUtils.create<ListboxCursorState<T>>(
            { highlightedValue: undefined, hasFocus: false },
            { isEqual: StoreUtils.getIsShallowEqual },
        );

        const typeahead = TypeaheadUtils.createBuffer();

        const getIsOpen = () => defs.getIsOpen?.() ?? true;
        const getIsFilterable = () => defs.getIsFilterable?.() ?? false;
        const getIsMultiple = () => defs.getIsMultiple?.() ?? false;
        const getHasMoreOptions = () => defs.getHasMoreOptions?.() ?? false;

        const setHighlightedValue = (highlightedValue: T | undefined) =>
            store.set({ ...store.get(), highlightedValue });

        const readHighlightedIndex = (options: SelectOption<T, D>[], navigable: number[]) =>
            computeHighlightedIndex({
                options,
                navigable,
                highlightedValue: store.get().highlightedValue,
                selectedValue: defs.getSelectedOptions()[0]?.value,
                isHighlightExplicit: defs.isHighlightExplicit ?? false,
                isFiltering: defs.getIsFiltering?.() ?? false,
            });

        const getHighlightedIndex = () => {
            const options = SelectUtils.getFlatOptions(defs.getOptions());

            return readHighlightedIndex(options, getNavigableIndexes(options));
        };

        const highlight = (value: T | undefined) => {
            if (store.get().highlightedValue === value) return false;

            setHighlightedValue(value);

            return true;
        };

        const pick = (value: T) => {
            if (defs.getIsDisabled()) return false;

            defs.onPick(value);

            if (getIsMultiple()) {
                highlight(value);

                return true;
            }

            defs.onClose?.();

            return true;
        };

        const handleKeyDown = (e: KeyboardEvent) => {
            if (defs.getIsDisabled()) return;

            const options = SelectUtils.getFlatOptions(defs.getOptions());
            const navigable = getNavigableIndexes(options);
            const isOpen = getIsOpen();
            const isFilterable = getIsFilterable();

            if (e.key === "Tab") {
                if (isOpen) defs.onClose?.();

                return;
            }

            const query = isFilterable ? undefined : typeahead.push(e);

            if (query !== undefined) {
                e.preventDefault();
                defs.onOpen?.();

                const listboxId = defs.getListboxId();
                const from = navigable.indexOf(readHighlightedIndex(options, navigable) ?? -1);
                const position = TypeaheadUtils.computeNextIndex(query, from, navigable.length, (index) =>
                    computeOptionText(listboxId, navigable[index], options[navigable[index]], defs.computeCustomText),
                );

                if (position === undefined) return;

                setHighlightedValue(options[navigable[position]].value);

                return;
            }

            if (NavigatorUtils.getIsActivationKey(e.key) && (e.key !== " " || !isFilterable)) {
                const highlightedIndex = readHighlightedIndex(options, navigable);

                if (defs.isHighlightExplicit && (!isOpen || highlightedIndex === undefined)) {
                    if (isOpen) defs.onClose?.();

                    return;
                }

                e.preventDefault();

                if (!isOpen) {
                    defs.onOpen?.();

                    return;
                }

                if (highlightedIndex === undefined || options[highlightedIndex].isDisabled) return;

                pick(options[highlightedIndex].value);

                return;
            }

            if (navigable.length < 1) return;

            const walkOpts = {
                orientation: defs.getOrientation?.() ?? LISTBOX_DEFAULTS.orientation,
                direction: defs.getDirection?.(),
                hasEdgeKeys: !isFilterable,
            };
            const highlightedIndex = readHighlightedIndex(options, navigable);
            const from =
                highlightedIndex === undefined
                    ? computeUnplacedFrom(e.key, navigable.length, walkOpts)
                    : navigable.indexOf(highlightedIndex);
            const position = NavigatorUtils.computeNextPosition(e.key, from, navigable.length, walkOpts);

            if (position === undefined) return;

            const isStep = e.key !== FIRST_KEY && e.key !== LAST_KEY;
            const hasWrapped =
                (position === 0 && from === navigable.length - 1) || (position === navigable.length - 1 && from === 0);

            if (isStep && hasWrapped && getHasMoreOptions()) return;

            const next = isOpen || !isStep || defs.isHighlightExplicit ? navigable[position] : highlightedIndex;

            if (next === undefined) return;

            e.preventDefault();

            const nextValue = options[next].value;

            defs.onOpen?.();
            setHighlightedValue(nextValue);
        };

        return {
            get: store.get,
            subscribe: store.subscribe,
            getHighlightedIndex,
            setHasFocus: (hasFocus) => store.set({ ...store.get(), hasFocus }),
            highlight,
            pick,
            handleKeyDown,
            clear: typeahead.clear,
        };
    };
}
