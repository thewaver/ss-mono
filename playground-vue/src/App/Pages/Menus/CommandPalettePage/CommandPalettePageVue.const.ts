import { type ResolvedShortcut, ShortcutUtils } from "@thewaver/ss-components-vue";
import { CommandPalettePageUtils } from "@thewaver/ss-playground/App/Pages/Menus/CommandPalettePage/CommandPalettePage.utils";

export * from "@thewaver/ss-playground/App/Pages/Menus/CommandPalettePage/CommandPalettePage.const";

export const formatPageResolvedShortcut = (shortcut: ResolvedShortcut | undefined) =>
    shortcut === undefined
        ? undefined
        : CommandPalettePageUtils.formatShortcut(shortcut, ShortcutUtils.getIsApplePlatform());
