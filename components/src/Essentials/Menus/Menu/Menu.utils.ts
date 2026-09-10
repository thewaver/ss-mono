import type { MenuItem, MenuItemKind, MenuRun } from "./Menu.types";

/** An item that does not say otherwise is a plain command. */
const DEFAULT_MENU_ITEM_KIND: MenuItemKind = "command";

/**
 * Groups a flat list of menu items into the runs the markup needs.
 *
 * A menu is written as one list, but a screen reader needs to know which items are radio choices
 * belonging together — a group of three is announced as "1 of 3" only if something says where the
 * group starts and ends. Adjacency is what defines a group, so no explicit grouping is asked of the
 * caller.
 */
export namespace MenuUtils {
    /** An item's kind, filled in where it was left out. */
    export const getKind = <T>(item: MenuItem<T>): MenuItemKind => item.kind ?? DEFAULT_MENU_ITEM_KIND;

    /** Whether an item carries a state of its own — a checkbox or a radio choice — rather than simply being pressed. */
    export const getIsStateful = <T>(item: MenuItem<T>) => getKind(item) !== "command";

    /**
     * The values of the radio group an item belongs to.
     *
     * For the item's own state: a radio choice is selected when the menu's value is its own, and it
     * needs its group's values to know what the alternatives were.
     *
     * @param items The menu's items.
     * @param index The item to ask about.
     * @returns The values of every radio item adjacent to it, itself included, or an empty list when it
     * is not a radio item.
     */
    export const getRadioGroupValues = <T>(items: MenuItem<T>[], index: number): T[] => {
        if (items[index] === undefined || getKind(items[index]) !== "radio") return [];

        let from = index;
        let to = index;

        while (from > 0 && getKind(items[from - 1]) === "radio") from--;
        while (to < items.length - 1 && getKind(items[to + 1]) === "radio") to++;

        return items.slice(from, to + 1).map((item) => item.value);
    };

    /**
     * Splits the items into consecutive runs, radio items grouped.
     *
     * @param items The menu's items, in order.
     * @returns One run per group of adjacent radio items and one per item of any other kind, each
     * carrying the index it starts at so a caller can map back to the original list. A run marked
     * `isRadioGroup` is what gets wrapped in a group element.
     */
    export const getRuns = <T>(items: MenuItem<T>[]): MenuRun<T>[] => {
        const runs: MenuRun<T>[] = [];

        items.forEach((item, index) => {
            const isRadio = getKind(item) === "radio";
            const last = runs[runs.length - 1];

            if (isRadio && last?.isRadioGroup) {
                last.items.push(item);

                return;
            }

            runs.push({ from: index, items: [item], isRadioGroup: isRadio });
        });

        return runs;
    };
}
