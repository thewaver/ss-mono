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

export const DIFF_CONTENT = [
    "The class map is [sub]the library's[/sub][add]the consumer's[/add], so this page can name",
    "[add][b]two tags of its own[/b][/add] and paint them [sub]the way every other tag is painted[/sub]",
    "[add]however it likes[/add].",
].join(" ");

export const GLOSSARY_CONTENT = [
    'The keep was raised by masons paid in [term tip="A weight of silver, not a coin — eight ounces, counted rather than struck."]marks[/term]',
    'rather than in coin, and every payment was cut into a [term tip="A split stick notched with the sum, one half kept by each side."][i]tally[/i][/term],',
    "which is why the accounts survive at all.",
].join(" ");

export const LINKS_CONTENT = [
    'Every link here is drawn by the page: this one goes to the [a href="/tooltip"]Tooltip page[/a],',
    'this one [a href="https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a"]leaves the site[/a],',
    'this one is [a href="/shape"][b]bold inside a link[/b][/a], and',
    '[a href="javascript:alert(1)"]this one[/a] was turned down by the page, so it prints as typed.',
].join(" ");
