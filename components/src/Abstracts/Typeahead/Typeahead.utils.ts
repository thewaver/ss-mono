import { createSignal, onCleanup } from "solid-js";

import type { TypeaheadDefs, TypeaheadHandle } from "./Typeahead.types";

/** How long typed characters accumulate before the search starts over. */
const DEFAULT_TYPEAHEAD_TIMEOUT_MS = 1000;
/** Nothing typed. */
const EMPTY_QUERY = "";

/** Space, which selects rather than searches unless a search is already under way. */
const SPACE_KEY = " ";
/** One character, counted by code point so an emoji or an accented letter counts as one. */
const SINGLE_CHARACTER = 1;
/** The `aria-hidden` value that means the element is not in fact hidden. */
const NOT_HIDDEN = "false";

/**
 * Reads an element's text as a screen reader would.
 *
 * Anything marked `aria-hidden` is skipped, which is what keeps a decorative icon or a keyboard
 * shortcut hint out of what the user is searching against.
 */
const readText = (node: Node): string => {
    if (node.nodeType === Node.TEXT_NODE) return node.nodeValue ?? "";
    if (!(node instanceof Element)) return "";

    const hidden = node.getAttribute("aria-hidden");

    if (hidden !== null && hidden !== NOT_HIDDEN) return "";

    return [...node.childNodes].map(readText).join("");
};

/**
 * Finds the item a user is looking for as they type its first letters.
 *
 * The behaviour every native list control has: typing jumps to the matching item, typing more
 * narrows it, and pressing one letter repeatedly cycles through everything starting with it.
 */
export namespace TypeaheadUtils {
    /**
     * The text of an option, as a screen reader would read it.
     *
     * Using the rendered text means the search matches what the user can see, without a component
     * having to keep a parallel list of labels.
     *
     * @param element The option's element. Missing gives an empty string.
     */
    export const getElementText = (element: Element | null | undefined) => (element ? readText(element) : "");

    /**
     * Whether a keystroke should be added to the search.
     *
     * Single characters only, and not while a modifier is held, so shortcuts still reach the browser.
     * Space is the exception: it selects the focused item, except while a search is under way, where it
     * must be a searchable character so that two-word labels can be typed.
     *
     * @param e The keyboard event.
     * @param hasQuery Whether a search is already under way.
     */
    export const getIsQueryKey = (e: KeyboardEvent, hasQuery: boolean) => {
        if (e.ctrlKey || e.metaKey || e.altKey) return false;
        if ([...e.key].length !== SINGLE_CHARACTER) return false;

        return e.key !== SPACE_KEY || hasQuery;
    };

    /**
     * Whether the query is one character typed several times.
     *
     * That is the cycling gesture rather than a search for a repeated string, and it is treated
     * differently.
     */
    export const getIsRepeat = (query: string) =>
        query.length > SINGLE_CHARACTER && [...query].every((character) => character === query[0]);

    /**
     * Which item a query matches.
     *
     * The search starts from the item after the current one, so pressing the same letter again advances
     * to the next match rather than sticking on the one already found. A longer query starts from the
     * current item instead, since narrowing a search should keep the item it already found if it still
     * matches.
     *
     * Matching is on the start of the text, case-insensitively, with leading whitespace ignored so that
     * an indented option still matches.
     *
     * @param query What has been typed.
     * @param from Where the cursor is now.
     * @param length How many items there are.
     * @param computeText Reads an item's text.
     * @returns The matching item's index, or `undefined` when nothing matches.
     */
    export const computeNextIndex = (
        query: string,
        from: number,
        length: number,
        computeText: (index: number) => string,
    ) => {
        if (length < 1 || query.length < 1) return;

        const search = (getIsRepeat(query) ? query[0] : query).toLowerCase();
        const start = search.length === SINGLE_CHARACTER ? 1 : 0;

        for (let offset = start; offset < length; offset++) {
            const index = (Math.max(from, 0) + offset) % length;

            if (computeText(index).trimStart().toLowerCase().startsWith(search)) return index;
        }
    };

    /**
     * Accumulates typed characters into a query that expires.
     *
     * @param defs.getTimeoutMs How long to wait after the last keystroke before starting over. A second
     * by default, which is what native controls use.
     * @returns `getQuery` for what has been typed, `clear` to start over, and `push` to offer a
     * keystroke. `push` returns the new query when the keystroke was taken and nothing when it was not,
     * so a caller can tell whether to search or to let the key through.
     */
    export const createBuffer = (defs?: TypeaheadDefs): TypeaheadHandle => {
        const [getQuery, setQuery] = createSignal(EMPTY_QUERY);

        let timer: ReturnType<typeof setTimeout> | undefined;

        const clear = () => {
            clearTimeout(timer);
            timer = undefined;
            setQuery(EMPTY_QUERY);
        };

        onCleanup(clear);

        return {
            getQuery,
            clear,
            push: (e) => {
                if (!getIsQueryKey(e, getQuery() !== EMPTY_QUERY)) return;

                const next = getQuery() + e.key;

                clearTimeout(timer);
                timer = setTimeout(clear, defs?.getTimeoutMs?.() ?? DEFAULT_TYPEAHEAD_TIMEOUT_MS);
                setQuery(next);

                return next;
            },
        };
    };
}
