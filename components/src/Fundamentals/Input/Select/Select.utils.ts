import { FlattenerUtils } from "../../../Abstracts/Flattener/Flattener.utils";
import type { SelectItem, SelectOption, SelectOptionGroup, SelectRow } from "./Select.types";

export namespace SelectUtils {
    export const getIsGroup = <T>(item: SelectItem<T>): item is SelectOptionGroup<T> => "options" in item;

    export const getItemRows = <T>(items: SelectItem<T>[]): SelectRow<T>[] =>
        FlattenerUtils.getRows(items, {
            computeChildren: (item) => (getIsGroup(item) ? item.options : undefined),
            computeIsBranch: getIsGroup,
            computeIsEntry: (item) => !getIsGroup(item),
        });

    export const getGroupRowIndex = <T>(row: SelectRow<T>) => (getIsGroup(row.node) ? row.index : row.parentIndex);

    export const getFlatOptions = <T>(items: SelectItem<T>[]): SelectOption<T>[] =>
        items.flatMap((item) => (getIsGroup(item) ? item.options : [item]));
}
