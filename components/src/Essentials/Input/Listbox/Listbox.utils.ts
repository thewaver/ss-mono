import { createEffect, createMemo, createSignal, on, untrack } from "solid-js";

import { FlattenerUtils } from "../../../Abstracts/Flattener/Flattener.utils";
import { InteractionTrackerUtils } from "../../../Abstracts/InteractionTracker/InteractionTracker.utils";
import type { NavigatorDirection } from "../../../Abstracts/Navigator/Navigator.types";
import { NavigatorUtils } from "../../../Abstracts/Navigator/Navigator.utils";
import { TypeaheadUtils } from "../../../Abstracts/Typeahead/Typeahead.utils";
import { SelectUtils } from "../Select/Select.utils";
import type { ListboxCursor, ListboxCursorDefs, ListboxOrientation } from "./Listbox.types";

/** Which arrows walk a list that was not told otherwise. */
const DEFAULT_ORIENTATION: ListboxOrientation = "vertical";
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
/** Stands in for a question nobody asked, which is always answered no. */
const NEVER = () => false;
/** Stands in for a list with no popup, which is always open. */
const ALWAYS = () => true;

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
     * Holds what a list of options needs between keystrokes: which option is highlighted, which ones can be reached,
     * and how a key moves or picks.
     *
     * One cursor serves a list whose options are drawn inside a popup opened from a field and a list standing on its
     * own in the page. The difference between the two is `focusModel`, fixed by whoever creates the cursor. Under
     * `"activeDescendant"` focus stays on the field and the highlight is announced through
     * {@link ListboxCursor.getActiveOptionId}; under `"roving"` each option takes focus itself, the highlighted one is
     * the list's single tab stop, and moving the highlight while focus is inside the list moves focus with it.
     *
     * The highlight is held as a value and resolved to an index, so a list that changes underneath it keeps pointing
     * at the same option, or falls back rather than pointing at a neighbor. With nothing moved to yet it falls back to
     * the first picked option — unless the list is being filtered, where it prefers the first option — and then to the
     * first option that can be reached. Pass `isHighlightExplicit` for a list whose options only suggest, where
     * nothing is highlighted until the reader moves there, so Enter can still mean the text that was typed.
     *
     * Disabled options are skipped by the walk unless they are reachable while disabled, in which case the walk stops
     * on them and a pick refuses them. Closing clears the highlight, whatever closed the list.
     *
     * It must be called inside a component, since it owns signals, a typeahead buffer and effects.
     *
     * @param opts.focusModel Where focus sits while the reader walks the options.
     * @param opts.isHighlightExplicit Leaves nothing highlighted until the reader moves to an option.
     * @param opts.getListboxId The id of the element carrying `role="listbox"`. Every option's id is built from it.
     * @param opts.getOptions The options and groups, in the order they are shown.
     * @param opts.getSelectedOptions The options currently picked; the first is where the highlight falls back to.
     * @param opts.getIsDisabled Whether the list refuses every key.
     * @param opts.getIsMultiple Whether a pick keeps the list open and moves the highlight to what was picked. Left out,
     * a pick closes it.
     * @param opts.getIsOpen Whether the options are on screen. Left out, the list is always open.
     * @param opts.getIsFilterable Whether the keys go to an editable field first: Space types, Home and End move the
     * caret, and typing does not jump to a match.
     * @param opts.getIsFiltering Whether the list is being narrowed right now, so the highlight prefers the first
     * option over the picked one.
     * @param opts.getHasMoreOptions Whether more options are still to come, so an arrow at either end does not wrap
     * round past options that have not arrived.
     * @param opts.getOrientation Which arrows walk the list. Vertical when left out.
     * @param opts.getDirection The page's text direction, which decides which horizontal arrow moves forward.
     * @param opts.computeCustomText The text an option is found by when the reader types, where its element has none
     * to read — an option out of view in a windowed list, or one drawn without text. Left out, such an option is found
     * by its value written out as text, so a windowed list of plain strings still answers typing.
     * @param opts.onOpen Asked for when a key should open the list.
     * @param opts.onClose Asked for when a key or a pick should close it.
     * @param opts.onPick Told which value was picked.
     * @returns The cursor: the rows to draw, the highlight, the ids, and `handleKeyDown` for whichever element holds
     * focus. `highlight` and `pick` report whether they changed anything.
     */
    export const createCursor = <T>(opts: ListboxCursorDefs<T>): ListboxCursor<T> => {
        const [getHighlightedValue, setHighlightedValue] = createSignal<T | undefined>();
        const [getHasFocus, setHasFocus] = createSignal(false);

        const typeahead = TypeaheadUtils.createBuffer();

        const getIsOpen = opts.getIsOpen ?? ALWAYS;
        const getIsFilterable = opts.getIsFilterable ?? NEVER;
        const getIsFiltering = opts.getIsFiltering ?? NEVER;
        const getIsMultiple = opts.getIsMultiple ?? NEVER;
        const getHasMoreOptions = opts.getHasMoreOptions ?? NEVER;
        const isRoving = opts.focusModel === "roving";

        const getOrientation = createMemo(() => opts.getOrientation?.() ?? DEFAULT_ORIENTATION);

        const getOptions = createMemo(() => opts.getOptions());

        const getItemRows = createMemo(() => SelectUtils.getItemRows(getOptions()));

        const getFlatOptions = createMemo(() => SelectUtils.getFlatOptions(getOptions()));

        const getRows = createMemo(() => FlattenerUtils.getFlatRows(getItemRows()));

        const getNavigableIndexes = createMemo(() =>
            getFlatOptions().reduce<number[]>((acc, option, index) => {
                const isReachable = InteractionTrackerUtils.computeIsReachable(
                    option.isDisabled ?? false,
                    option.isReachableWhenDisabled ?? false,
                );

                if (!option.isDisabled || isReachable) acc.push(index);

                return acc;
            }, []),
        );

        const getHighlightedIndex = createMemo(() => {
            const navigable = getNavigableIndexes();
            const options = getFlatOptions();
            const highlightedValue = getHighlightedValue();

            const highlightedIndex = navigable.find((index) => options[index].value === highlightedValue);

            if (highlightedIndex !== undefined || opts.isHighlightExplicit) return highlightedIndex;

            const selectedValue = opts.getSelectedOptions()[0]?.value;
            const selectedIndex = navigable.find((index) => options[index].value === selectedValue);

            if (!getIsFiltering() && selectedIndex !== undefined) return selectedIndex;

            return navigable[0];
        });

        const getIsHighlightShown = createMemo(() => !isRoving || getHasFocus());

        const getOptionId = (index: number) => `${opts.getListboxId()}-option-${index}`;

        const getActiveOptionId = createMemo(() => {
            const highlightedIndex = getHighlightedIndex();

            if (isRoving || !getIsOpen() || highlightedIndex === undefined) return;

            return getOptionId(highlightedIndex);
        });

        const computeOptionText = (index: number) => {
            const option = getFlatOptions()[index];
            const custom = opts.computeCustomText?.(option);

            if (custom !== undefined) return custom;

            const painted = TypeaheadUtils.getElementText(document.getElementById(getOptionId(index)));

            return painted.length > 0 ? painted : String(option.value);
        };

        createEffect(() => {
            if (getIsOpen()) return;

            setHighlightedValue(() => undefined);
        });

        if (isRoving) {
            createEffect(
                on(getHighlightedIndex, (index) => {
                    if (index === undefined || !untrack(getHasFocus)) return;

                    const element = document.getElementById(getOptionId(index));

                    if (!element || element === document.activeElement) return;

                    element.focus({ preventScroll: true });
                }),
            );
        }

        const highlight = (value: T | undefined) => {
            if (untrack(getHighlightedValue) === value) return false;

            setHighlightedValue(() => value);

            return true;
        };

        const pick = (value: T) => {
            if (opts.getIsDisabled()) return false;

            opts.onPick(value);

            if (getIsMultiple()) {
                highlight(value);

                return true;
            }

            opts.onClose?.();

            return true;
        };

        const handleKeyDown = (e: KeyboardEvent) => {
            if (opts.getIsDisabled()) return;

            const options = getFlatOptions();
            const navigable = getNavigableIndexes();
            const isOpen = getIsOpen();
            const isFilterable = getIsFilterable();

            if (e.key === "Tab") {
                if (isOpen) opts.onClose?.();

                return;
            }

            const query = isFilterable ? undefined : typeahead.push(e);

            if (query !== undefined) {
                e.preventDefault();
                opts.onOpen?.();

                const from = navigable.indexOf(getHighlightedIndex() ?? -1);
                const position = TypeaheadUtils.computeNextIndex(query, from, navigable.length, (index) =>
                    computeOptionText(navigable[index]),
                );

                if (position === undefined) return;

                setHighlightedValue(() => options[navigable[position]].value);

                return;
            }

            if (NavigatorUtils.getIsActivationKey(e.key) && (e.key !== " " || !isFilterable)) {
                const highlightedIndex = getHighlightedIndex();

                if (opts.isHighlightExplicit && (!isOpen || highlightedIndex === undefined)) {
                    if (isOpen) opts.onClose?.();

                    return;
                }

                e.preventDefault();

                if (!isOpen) {
                    opts.onOpen?.();

                    return;
                }

                if (highlightedIndex === undefined || options[highlightedIndex].isDisabled) return;

                pick(options[highlightedIndex].value);

                return;
            }

            if (navigable.length < 1) return;

            const walkOpts = {
                orientation: getOrientation(),
                direction: opts.getDirection?.(),
                hasEdgeKeys: !isFilterable,
            };
            const highlightedIndex = getHighlightedIndex();
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

            const next = isOpen || !isStep || opts.isHighlightExplicit ? navigable[position] : highlightedIndex;

            if (next === undefined) return;

            e.preventDefault();

            const nextValue = options[next].value;

            opts.onOpen?.();
            setHighlightedValue(() => nextValue);
        };

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
            getActiveOptionId,
            getOptionId,
            setHasFocus,
            highlight,
            pick,
            handleKeyDown,
        };
    };
}
