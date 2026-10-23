import type { Shortcut } from "@thewaver/ss-components";

export const APP_PALETTE_SHORTCUT: Shortcut = { key: "k", modifiers: ["mod"] };

export const APP_COMMANDS = {
    goToAbout: "Go to About",
    cycleTheme: "Switch to the next theme",
    expandAll: "Expand every menu folder",
    collapseAll: "Collapse every menu folder",
};

export const APP_COMMAND_SHORTCUTS: Record<keyof typeof APP_COMMANDS, Shortcut> = {
    goToAbout: { key: "h", modifiers: ["alt", "shift"] },
    cycleTheme: { key: "t", modifiers: ["alt", "shift"] },
    expandAll: { key: "e", modifiers: ["alt", "shift"] },
    collapseAll: { key: "c", modifiers: ["alt", "shift"] },
};

export const APP_COMMAND_GROUPS = {
    view: "View",
    pages: "Go to a page",
};

export const GO_TO_PAGE_PREFIX = "Go to ";
