import { type ResolvedShortcut, type Shortcut, ShortcutUtils } from "@thewaver/ss-components-vue";
import { CommandPalettePageUtils } from "@thewaver/ss-playground/App/Pages/Menus/CommandPalettePage/CommandPalettePage.utils";

export * from "@thewaver/ss-playground/App/Pages/Menus/CommandPalettePage/CommandPalettePage.const";

export const formatPageResolvedShortcut = (shortcut: ResolvedShortcut | undefined) =>
    shortcut === undefined
        ? undefined
        : CommandPalettePageUtils.formatShortcut(shortcut, ShortcutUtils.getIsApplePlatform());

export const formatPageShortcut = (shortcut: Shortcut | undefined) =>
    shortcut === undefined ? undefined : formatPageResolvedShortcut(ShortcutUtils.resolve(shortcut));
