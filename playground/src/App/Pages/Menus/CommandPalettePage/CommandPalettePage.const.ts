import type { CommandPaletteItemRecord, Shortcut, ShortcutKeyModifier } from "@thewaver/ss-components";

export const EXAMPLE_NAMES = {
    default: "Opened by a shortcut",
    actionShortcuts: "Actions with shortcuts of their own",
    bareLetter: "A bare-letter shortcut",
};

export const EXAMPLES_ROOT = "/src/App/Pages/Menus/CommandPalettePage/Examples";

export const NOTHING_RUN = "nothing yet";

export const APPLE_MODIFIER_GLYPHS: Record<ShortcutKeyModifier, string> = {
    ctrl: "⌃",
    alt: "⌥",
    shift: "⇧",
    meta: "⌘",
};

export const MODIFIER_NAMES: Record<ShortcutKeyModifier, string> = {
    ctrl: "Ctrl",
    alt: "Alt",
    shift: "Shift",
    meta: "Meta",
};

export const MODIFIER_SEPARATOR = "+";

export const GROUPED_ACTIONS: CommandPaletteItemRecord<string, never>[] = [
    {
        label: "Navigation",
        options: [{ value: "Go to the home page" }, { value: "Go to the settings" }, { value: "Go to your profile" }],
    },
    {
        label: "Appearance",
        options: [{ value: "Use the light theme" }, { value: "Use the dark theme" }, { value: "Use larger text" }],
    },
    {
        label: "Help",
        options: [
            { value: "Read the documentation" },
            { value: "Report a problem" },
            { value: "Ask for a feature", isDisabled: true },
        ],
    },
];

export const ADD_NOTE = "Add a note";
export const REMOVE_NOTE = "Remove the last note";
export const CLEAR_NOTES = "Clear the notes";

export const NOTE_ACTIONS: CommandPaletteItemRecord<string, never>[] = [
    {
        label: "Notes",
        options: [
            { value: ADD_NOTE, shortcut: { key: "n", modifiers: ["alt", "shift"] } },
            { value: REMOVE_NOTE, shortcut: { key: "r", modifiers: ["alt", "shift"] } },
            { value: CLEAR_NOTES, shortcut: { key: "x", modifiers: ["alt", "shift"] } },
        ],
    },
    {
        label: "Help",
        options: [{ value: "Read the documentation" }],
    },
];

export const GREET = "Say hello";

export const BARE_LETTER_SHORTCUT: Shortcut = { key: "g" };
