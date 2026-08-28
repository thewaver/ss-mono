import type { MenuItem, MenuItemKind, MenuRun } from "./Menu.types";

const DEFAULT_MENU_ITEM_KIND: MenuItemKind = "command";

export namespace MenuUtils {
    export const getKind = <T>(item: MenuItem<T>): MenuItemKind => item.kind ?? DEFAULT_MENU_ITEM_KIND;

    export const getIsStateful = <T>(item: MenuItem<T>) => getKind(item) !== "command";

    export const getRadioGroupValues = <T>(items: MenuItem<T>[], index: number): T[] => {
        if (items[index] === undefined || getKind(items[index]) !== "radio") return [];

        let from = index;
        let to = index;

        while (from > 0 && getKind(items[from - 1]) === "radio") from--;
        while (to < items.length - 1 && getKind(items[to + 1]) === "radio") to++;

        return items.slice(from, to + 1).map((item) => item.value);
    };

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
