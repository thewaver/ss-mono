import { createSignal, onCleanup } from "solid-js";

import type { TypeaheadDefs, TypeaheadHandle } from "./Typeahead.types";

const DEFAULT_TYPEAHEAD_TIMEOUT_MS = 1000;
const EMPTY_QUERY = "";

const SPACE_KEY = " ";
const SINGLE_CHARACTER = 1;
const NOT_HIDDEN = "false";

const readText = (node: Node): string => {
    if (node.nodeType === Node.TEXT_NODE) return node.nodeValue ?? "";
    if (!(node instanceof Element)) return "";

    const hidden = node.getAttribute("aria-hidden");

    if (hidden !== null && hidden !== NOT_HIDDEN) return "";

    return [...node.childNodes].map(readText).join("");
};

export namespace TypeaheadUtils {
    export const getElementText = (element: Element | null | undefined) => (element ? readText(element) : "");

    export const getIsQueryKey = (e: KeyboardEvent, hasQuery: boolean) => {
        if (e.ctrlKey || e.metaKey || e.altKey) return false;
        if ([...e.key].length !== SINGLE_CHARACTER) return false;

        return e.key !== SPACE_KEY || hasQuery;
    };

    export const getIsRepeat = (query: string) =>
        query.length > SINGLE_CHARACTER && [...query].every((character) => character === query[0]);

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
