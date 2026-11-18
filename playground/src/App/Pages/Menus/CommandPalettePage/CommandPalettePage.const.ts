import type { CommandPaletteItemRecord, Shortcut, ShortcutKeyModifier } from "@thewaver/ss-components";

export const DOCS_ROOT = "/src/App/Pages/Menus/CommandPalettePage/Docs";

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

export const DOCS_SECTIONS = {
    actionsWithOwnShortcuts: {
        title: "Actions with shortcuts of their own",
        content:
            "Give an action a [prop]shortcut[/prop] and pressing it runs the action from anywhere on the page, with the palette closed. Here Alt+Shift+N adds a note, Alt+Shift+R removes the last one and Alt+Shift+X clears them, with Option in place of Alt on a Mac. The palette writes each shortcut beside its action, handed to the option painter already resolved for the platform, so the list also teaches them. Every shortcut stays quiet while a dialog is open over the page, this palette included. The palette's own [prop]shortcut[/prop] opens it in the same way; no example here is given one, since Ctrl+K, or ⌘K on a Mac, already opens the Playground's own palette on every page, and the same shortcut registered twice warns in the console and runs only the later.",
    },
    bareLetterShortcut: {
        title: "A bare-letter shortcut",
        content:
            'A shortcut of a single character, with no modifier but Shift, is easy to set off by accident, so [wcag id="2.1.4"]WCAG 2.1.4[/wcag] asks that a person can turn it off or change it. It never runs while focus is in a text field, where the key is a letter like any other, and registering one warns in the console during development; this example warns on purpose. Here G says hello anywhere on the page but in the field. The Turn G off button below is the way to turn it off that the criterion asks for: it takes the shortcut off the action, and in your app it would be a setting.',
    },
    rightLeft: {
        title: "Right to left",
        content:
            "Opened from a box whose text runs right to left, the palette takes that direction although it is drawn over the whole page: the search field types from the right, and the group headings and the actions' names start at the right.",
    },
};

export const SEARCH_NOTE_ACTIONS_LABEL = "Search the note actions";

export const MATCHING_NOTE_ACTIONS_LABEL = "Matching note actions";

export const SEARCH_GREETINGS_LABEL = "Search the greetings";
