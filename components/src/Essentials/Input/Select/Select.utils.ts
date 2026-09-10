import { FlattenerUtils } from "../../../Abstracts/Flattener/Flattener.utils";
import type { SelectItem, SelectOption, SelectOptionGroup, SelectRow } from "./Select.types";

/** Flattens a select's options and groups into the rows its list draws. */
export namespace SelectUtils {
    /** Whether an item is a group of options rather than an option. */
    export const getIsGroup = <T>(item: SelectItem<T>): item is SelectOptionGroup<T> => "options" in item;

    /**
     * Turns options and groups into rows.
     *
     * Groups take a row of their own — they are drawn as headings — but are not selectable, so the
     * entry numbering skips them. That is what keeps a keyboard cursor and a selected index addressed
     * to real options while headings still occupy rows.
     *
     * @param items The options and groups, in the order they should appear.
     */
    export const getItemRows = <T>(items: SelectItem<T>[]): SelectRow<T>[] =>
        FlattenerUtils.getRows(items, {
            computeChildren: (item) => (getIsGroup(item) ? item.options : undefined),
            computeIsBranch: getIsGroup,
            computeIsEntry: (item) => !getIsGroup(item),
        });

    /**
     * Which row holds the group a row belongs to.
     *
     * @param row The row to ask about.
     * @returns The group's own row number — itself, for a group heading — or `undefined` for an option
     * outside any group. This is what an option's `aria-describedby` points at, so a screen reader
     * announces which group it is in.
     */
    export const getGroupRowIndex = <T>(row: SelectRow<T>) => (getIsGroup(row.node) ? row.index : row.parentIndex);

    /**
     * Every option, with the groups dissolved.
     *
     * For anything that works on the options themselves rather than on what is drawn: finding the
     * selected one, matching a typed query, reporting a count.
     *
     * @param items The options and groups.
     */
    export const getFlatOptions = <T>(items: SelectItem<T>[]): SelectOption<T>[] =>
        items.flatMap((item) => (getIsGroup(item) ? item.options : [item]));
}
