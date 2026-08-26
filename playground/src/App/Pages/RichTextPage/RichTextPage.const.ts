export const FIELD_WIDTH = 420;
export const MIN_ROWS = 8;
export const MAX_ROWS = 16;
export const PREVIEW_WIDTH = 420;

export const TAG_DEFS = [
    { tag: "b", name: "bold" },
    { tag: "i", name: "italic" },
    { tag: "s", name: "strikethrough" },
    { tag: "u", name: "underlined" },
    { tag: "li", name: "an item" },
];

export const STARTING_CONTENT = [
    "[b]Rich text[/b] paints a [i]plain string[/i], so the words can arrive from anywhere — a server, a file, or a field like this one.",
    "",
    "[li]a first item[/li]",
    "[li]a second item, with [u]a word underlined[/u][/li]",
    "[li]a third item that is [s]no longer true[/s][/li]",
    "",
    "An [warning]unknown tag[/warning] stays put unless you ask for it to go, and an [b]unclosed one is printed the way it was typed.",
].join("\n");
