import type { CommandPaletteItemRecord } from "@thewaver/ss-components";

import { APP_COMMANDS, APP_COMMAND_GROUPS, APP_COMMAND_SHORTCUTS, GO_TO_PAGE_PREFIX } from "./AppCommands.const";

export const toGoToPageCommand = (pageName: string) => `${GO_TO_PAGE_PREFIX}${pageName}`;

export const computeAppCommandItems = (pageNames: string[]): CommandPaletteItemRecord<string, never>[] => [
    {
        label: APP_COMMAND_GROUPS.view,
        options: [
            { value: APP_COMMANDS.cycleTheme, shortcut: APP_COMMAND_SHORTCUTS.cycleTheme },
            { value: APP_COMMANDS.expandAll, shortcut: APP_COMMAND_SHORTCUTS.expandAll },
            { value: APP_COMMANDS.collapseAll, shortcut: APP_COMMAND_SHORTCUTS.collapseAll },
        ],
    },
    {
        label: APP_COMMAND_GROUPS.pages,
        options: [
            { value: APP_COMMANDS.goToAbout, shortcut: APP_COMMAND_SHORTCUTS.goToAbout },
            ...pageNames.map((pageName) => ({ value: toGoToPageCommand(pageName) })),
        ],
    },
];
