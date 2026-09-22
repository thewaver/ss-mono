import type { Accessor } from "solid-js";
import { createSignal } from "solid-js";

import type { CheckedState } from "../CheckedState/CheckedState.types";
import { CheckedStateUtils } from "../CheckedState/CheckedState.utils";
import type { SelectionBranchDefs, SelectionDefs, SelectionHandle } from "./Selection.types";

/** Stands in for a branch whose children accessor answered nothing, so the walk has something to iterate. */
const EMPTY_CHILDREN: never[] = [];
/** Nothing is selected. One shared array, so clearing an empty selection allocates nothing. */
const EMPTY_SELECTION: never[] = [];
/** What `indexOf` answers for an item that is not in the list. */
const NOT_FOUND = -1;

/** Whether two selections hold the same items in the same order, which is when a write would change nothing. */
const getIsUnchanged = <T>(selection: T[], next: T[]) =>
    selection.length === next.length && selection.every((item, index) => item === next[index]);

/** Folds child states into their parent's, where a child may itself be half-ticked. */
const getFoldedState = (states: CheckedState[]): CheckedState =>
    states.some((state) => state === "mixed")
        ? "mixed"
        : CheckedStateUtils.fromMembers(states.map((state) => state === true));

/**
 * Picking items out of a list: one of them, several, or the whole run between two.
 *
 * The arithmetic every multi-select control repeats — a click that replaces what was picked, a
 * modified click that adds one without losing the rest, a shifted click that takes everything
 * between here and wherever the last one was. It holds no selection of its own: the list belongs to
 * whoever is drawing it, and each function here takes the current one and returns the next.
 */
export namespace SelectionUtils {
    /**
     * The selection after one item is picked or unpicked.
     *
     * @param selection The current selection.
     * @param item The item picked.
     * @returns A new list with the item added at the end, or removed if it was already there.
     */
    export const getToggled = <T>(selection: T[], item: T) =>
        selection.includes(item) ? selection.filter((entry) => entry !== item) : [...selection, item];

    /**
     * The selection after a run of items is added to it.
     *
     * Items already selected are not duplicated, and what was there keeps its order, so extending a
     * selection does not disturb it.
     *
     * @param selection The current selection.
     * @param added The items to add.
     */
    export const getMerged = <T>(selection: T[], added: T[]) => [
        ...selection,
        ...added.filter((item) => !selection.includes(item)),
    ];

    /**
     * Every item between two, both ends included, whichever way round they were given.
     *
     * The two ends are items rather than positions, so the caller is spared holding an index that a
     * sort or a filter would quietly invalidate. An end that is not in the list produces nothing,
     * which is the signal to leave the selection alone.
     *
     * @param items The list, in the order it is drawn.
     * @param from One end of the run.
     * @param to The other end.
     */
    export const getRange = <T>(items: T[], from: T, to: T): T[] => {
        const fromIndex = items.indexOf(from);
        const toIndex = items.indexOf(to);

        if (fromIndex === NOT_FOUND || toIndex === NOT_FOUND) return EMPTY_SELECTION;

        return items.slice(Math.min(fromIndex, toIndex), Math.max(fromIndex, toIndex) + 1);
    };

    /**
     * A branch and everything under it, however deep, the branch itself first.
     *
     * Ticking a folder is understood to tick what is inside it, so a caller needs the whole subtree
     * rather than the one node it was handed.
     *
     * @param item The branch. A leaf comes back on its own.
     * @param defs The caller's accessor for the shape of its own tree.
     */
    export const getBranchItems = <T>(item: T, defs: SelectionBranchDefs<T>): T[] => [
        item,
        ...(defs.computeChildren(item) ?? EMPTY_CHILDREN).flatMap((child) => getBranchItems(child, defs)),
    ];

    /**
     * What a branch's own tick box should show, given what is selected under it.
     *
     * A leaf answers for itself. A branch answers for its children — ticked when every one of them
     * is, empty when none is, and half-ticked when they disagree or when one of them is itself
     * half-ticked. A branch's own place in the selection is not read here: a folder follows what is
     * inside it rather than the other way round.
     *
     * @param item The node to judge.
     * @param selection The current selection.
     * @param defs The caller's accessor for the shape of its own tree.
     * @returns `true`, `false` or `"mixed"`, which is what a tri-state box and `aria-checked` both want.
     */
    export const getBranchState = <T>(item: T, selection: T[], defs: SelectionBranchDefs<T>): CheckedState => {
        const children = defs.computeChildren(item) ?? EMPTY_CHILDREN;

        if (children.length < 1) return selection.includes(item);

        return getFoldedState(children.map((child) => getBranchState(child, selection, defs)));
    };

    /**
     * The selection after a branch's tick box is pressed.
     *
     * A fully ticked branch empties and anything else fills, which is what a half-ticked box does
     * everywhere: the first press completes it rather than clearing it. The branch and every one of
     * its descendants move together, so a consumer never has to reconcile a folder with its contents.
     *
     * @param item The branch pressed.
     * @param selection The current selection.
     * @param defs The caller's accessor for the shape of its own tree.
     */
    export const getBranchSelection = <T>(item: T, selection: T[], defs: SelectionBranchDefs<T>) => {
        const branch = getBranchItems(item, defs);

        if (getBranchState(item, selection, defs) === true) {
            return selection.filter((entry) => !branch.includes(entry));
        }

        return getMerged(selection, branch);
    };

    /**
     * Drives a selection from the gestures a control reports, remembering where a run should start.
     *
     * It owns the anchor and nothing else. The selection stays with the caller, because every control
     * already holds one and holds it differently — a consumer's signal here, a list of checked values
     * there. What no caller has a home for is the memory of where the last plain pick landed, which
     * is what a shifted pick measures its run from, and holding that as the item rather than as a
     * position is what lets the run survive the list being sorted or filtered underneath it.
     *
     * A write that would leave the selection holding the same items in the same order is skipped, so
     * extending a run back over ground it already covers notifies nobody.
     *
     * @param getIsDisabled Whether the control is off, in which case no gesture does anything.
     * @param defs.getMode Whether nothing can be picked, one thing can, or many can.
     * @param defs.getItems The list, in the order it is drawn. An item that is not in it is ignored.
     * @param defs.selectionSignal What is selected now, and how to change it.
     * @returns `pick` for a gesture on one item, `selectAll` and `clear` for the two wholesale moves,
     * and `getAnchor` for where a run would currently start.
     */
    export const create = <T>(getIsDisabled: Accessor<boolean>, defs: SelectionDefs<T>): SelectionHandle<T> => {
        const [getAnchor, setAnchor] = createSignal<T>();

        const setSelection = (next: T[]) => {
            if (getIsUnchanged(defs.selectionSignal[0](), next)) return;

            defs.selectionSignal[1](next);
        };

        return {
            getAnchor,
            pick: (item, gesture) => {
                const mode = defs.getMode();

                if (mode === "none" || getIsDisabled()) return;

                const items = defs.getItems();

                if (!items.includes(item)) return;

                const selection = defs.selectionSignal[0]();

                if (mode === "single") {
                    setAnchor(() => item);
                    setSelection(gesture?.isToggling === true && selection.includes(item) ? EMPTY_SELECTION : [item]);

                    return;
                }

                if (gesture?.isExtending === true) {
                    const anchor = getAnchor();

                    setSelection(getMerged(selection, getRange(items, anchor ?? item, item)));

                    return;
                }

                setAnchor(() => item);
                setSelection(gesture?.isToggling === true ? getToggled(selection, item) : [item]);
            },
            selectAll: () => {
                if (defs.getMode() !== "multiple" || getIsDisabled()) return;

                setSelection([...defs.getItems()]);
            },
            clear: () => {
                if (getIsDisabled()) return;

                setSelection(EMPTY_SELECTION);
            },
        };
    };
}
