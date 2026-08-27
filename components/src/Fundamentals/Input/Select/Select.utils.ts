import type { SelectItem, SelectOption, SelectOptionGroup, SelectRow } from "./Select.types";

export namespace SelectUtils {
    export const getIsGroup = <T>(item: SelectItem<T>): item is SelectOptionGroup<T> => "options" in item;

    export const getFlatOptions = <T>(items: SelectItem<T>[]): SelectOption<T>[] =>
        items.flatMap((item) => (getIsGroup(item) ? item.options : [item]));

    export const getItemOffsets = <T>(items: SelectItem<T>[]): number[] => {
        let offset = 0;

        return items.map((item) => {
            const start = offset;

            offset += getIsGroup(item) ? item.options.length : 1;

            return start;
        });
    };

    export const getRows = <T>(items: SelectItem<T>[]): SelectRow<T>[] => {
        const offsets = getItemOffsets(items);
        const rows: SelectRow<T>[] = [];

        items.forEach((item, itemIndex) => {
            if (!getIsGroup(item)) {
                rows.push({ group: undefined, groupIndex: undefined, option: item, optionIndex: offsets[itemIndex] });

                return;
            }

            rows.push({ group: item, groupIndex: itemIndex, option: undefined, optionIndex: undefined });

            item.options.forEach((option, groupIndex) => {
                rows.push({
                    group: item,
                    groupIndex: itemIndex,
                    option,
                    optionIndex: offsets[itemIndex] + groupIndex,
                });
            });
        });

        return rows;
    };

    export const getRowIndexOfOption = <T>(rows: SelectRow<T>[], optionIndex: number) =>
        rows.findIndex((row) => row.optionIndex === optionIndex);
}
