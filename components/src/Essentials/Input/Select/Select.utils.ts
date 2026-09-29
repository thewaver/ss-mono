import { FlattenerUtils } from "../../../Abstracts/Flattener/Flattener.utils";
import type {
    SelectItemRecord as SelectItem,
    SelectOptionRecord as SelectOption,
    SelectOptionGroupRecord as SelectOptionGroup,
    SelectRowRecord as SelectRow,
} from "./Select.types";

/** Nothing typed into the field. */
const EMPTY_QUERY = "";

/** Flattens a select's options and groups into the rows its list draws. */
export namespace SelectUtils {
    /** Whether an item is a group of options rather than an option. */
    export const getIsGroup = <T, D>(item: SelectItem<T, D>): item is SelectOptionGroup<T, D> => "options" in item;

    /**
     * Turns options and groups into rows.
     *
     * Groups take a row of their own — they are drawn as headings — but are not selectable, so the
     * entry numbering skips them. That is what keeps a keyboard cursor and a selected index addressed
     * to real options while headings still occupy rows.
     *
     * @param items The options and groups, in the order they should appear.
     */
    export const getItemRows = <T, D>(items: SelectItem<T, D>[]): SelectRow<T, D>[] =>
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
     * outside any group. Consecutive rows sharing an answer are one run, which is how a windowed list
     * knows where to cut a group box so only the part of it on screen is drawn.
     */
    export const getGroupRowIndex = <T, D>(row: SelectRow<T, D>) =>
        getIsGroup(row.node) ? row.index : row.parentIndex;

    /**
     * Every option, with the groups dissolved.
     *
     * For anything that works on the options themselves rather than on what is drawn: finding the
     * selected one, matching a typed query, reporting a count.
     *
     * @param items The options and groups.
     */
    export const getFlatOptions = <T, D>(items: SelectItem<T, D>[]): SelectOption<T, D>[] =>
        items.flatMap((item) => (getIsGroup(item) ? item.options : [item]));

    /**
     * How the popup list is named, given what the consumer said and where the field sits.
     *
     * A listbox has to be named. An exact name from the consumer is written as `aria-label`; without one the list
     * is labelled by the `Label` the field sits in, or by the field itself when there is none. Neither fallback is
     * exact — the `Label` reads everything inside it, the field's current text included — which is why the consumer's
     * own name always wins.
     *
     * @param opts.listAriaLabel The consumer's own name for the list, if any.
     * @param opts.labelId The id of the `Label` around the field, if there is one.
     * @param opts.fieldId The field's id.
     * @param opts.isMultiple Whether the list holds several values at once, which is announced on it.
     * @returns The attributes to write on the popup's `role="listbox"` element.
     */
    export const computeListAriaAttributes = (opts: {
        listAriaLabel: string | undefined;
        labelId: string | undefined;
        fieldId: string;
        isMultiple: boolean;
    }) => ({
        "aria-label": opts.listAriaLabel,
        "aria-labelledby": opts.listAriaLabel === undefined ? (opts.labelId ?? opts.fieldId) : undefined,
        "aria-multiselectable": opts.isMultiple || undefined,
    });

    /**
     * Whether a closed select should now empty the query its field was typed into.
     *
     * Closing ends the interaction, so the query is the select's to reset — but only once the popup has finished
     * fading out, because emptying it earlier repopulates the consumer's filtered list while it is still visibly
     * leaving. A query that is already empty is never written, so nothing is written on mount.
     *
     * @param isOpen Whether the popup is open.
     * @param hasPopupSettled Whether the popup's fade has finished since it last changed.
     * @param query What is in the field now.
     */
    export const getIsQueryClearDue = (isOpen: boolean, hasPopupSettled: boolean, query: string) =>
        !isOpen && hasPopupSettled && query !== EMPTY_QUERY;
}
