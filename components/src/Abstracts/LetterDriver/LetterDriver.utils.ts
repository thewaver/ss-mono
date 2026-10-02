import { StoreUtils } from "@thewaver/ss-utils";

import type { LetterRegistry, LetterRegistryEntry, LetterRegistryState } from "./LetterDriver.types";

const EMPTY_OFFSET = 0;

/** Orders two renderers by where their roots sit on the page, earlier first. */
const compareByPagePosition = (a: LetterRegistryEntry, b: LetterRegistryEntry) =>
    a.element.compareDocumentPosition(b.element) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1;

/**
 * The link between a component that decides what each letter does over time, such as `Typewriter` or
 * `ScrambleText`, and one that draws the letters, such as `PaintedText`.
 *
 * The wrapper owns the timing and the drawer owns the layout, so neither measures the other's work: the drawer
 * reports its letters, the wrapper reads them all as one text and answers, letter by letter, what each should be
 * doing. Several drawers inside one wrapper share one run, in the order they appear on the page.
 */
export namespace LetterDriverUtils {
    /**
     * Builds the registry a wrapper keeps its drawers in.
     *
     * Drawers are kept sorted by page position whenever one joins or changes, so the letters run in reading order
     * however they mounted. A drawer that reports the same letters again changes nothing.
     *
     * @returns The registry, readable as a store of every drawer and their letters run together.
     */
    export const createRegistry = (): LetterRegistry => {
        const store = StoreUtils.create<LetterRegistryState>(
            { entries: [], characters: [] },
            { isEqual: StoreUtils.getIsShallowEqual },
        );

        const write = (entries: LetterRegistryEntry[]) => {
            const sorted = [...entries].sort(compareByPagePosition);

            store.set({ entries: sorted, characters: sorted.flatMap((entry) => entry.characters) });
        };

        const register = (element: Element) => {
            write([...store.get().entries, { element, characters: [] }]);

            return {
                setCharacters: (characters: string[]) => {
                    const entries = store.get().entries;
                    const current = entries.find((entry) => entry.element === element);

                    if (!current || current.characters.join("") === characters.join("")) return;

                    write(entries.map((entry) => (entry.element === element ? { element, characters } : entry)));
                },
                unregister: () => write(store.get().entries.filter((entry) => entry.element !== element)),
            };
        };

        const getOffset = (element: Element) => {
            let offset = EMPTY_OFFSET;

            for (const entry of store.get().entries) {
                if (entry.element === element) return offset;

                offset += entry.characters.length;
            }

            return EMPTY_OFFSET;
        };

        return { get: store.get, subscribe: store.subscribe, register, getOffset };
    };
}
