import type { CommandPaletteItemRecord, ResolvedShortcut } from "@thewaver/ss-components";

import { APPLE_MODIFIER_GLYPHS, MODIFIER_NAMES, MODIFIER_SEPARATOR } from "./CommandPalettePage.const";

const formatKey = (key: string) => ([...key].length === 1 ? key.toUpperCase() : key);

export namespace CommandPalettePageUtils {
    export const formatShortcut = (shortcut: ResolvedShortcut, isApple: boolean) =>
        isApple
            ? [...shortcut.modifiers.map((modifier) => APPLE_MODIFIER_GLYPHS[modifier]), formatKey(shortcut.key)].join(
                  "",
              )
            : [...shortcut.modifiers.map((modifier) => MODIFIER_NAMES[modifier]), formatKey(shortcut.key)].join(
                  MODIFIER_SEPARATOR,
              );

    export const filterItems = <D>(items: CommandPaletteItemRecord<string, D>[], query: string) => {
        const needle = query.trim().toLocaleLowerCase();

        if (!needle) return items;

        const getIsMatch = (value: string) => value.toLocaleLowerCase().includes(needle);

        return items.flatMap((item): CommandPaletteItemRecord<string, D>[] => {
            if (!("options" in item)) return getIsMatch(item.value) ? [item] : [];

            const options = item.options.filter((option) => getIsMatch(option.value));

            return options.length > 0 ? [{ ...item, options }] : [];
        });
    };
}
