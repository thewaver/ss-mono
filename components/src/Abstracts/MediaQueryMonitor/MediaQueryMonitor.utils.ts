import { type Accessor, type Setter, createEffect, createSignal, onCleanup } from "solid-js";

/** The query for a user who has asked their system to reduce animation. */
const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

type QueryEntry = {
    getMatches: Accessor<boolean>;
    setMatches: Setter<boolean>;
    onChange: () => void;
    list: MediaQueryList | undefined;
    count: number;
};

/** One entry per query text, shared by every component asking for it. */
const entries = new Map<string, QueryEntry>();

/** The entry for a query, created on first use but not yet listening. */
const getEntry = (query: string) => {
    const existing = entries.get(query);

    if (existing) return existing;

    const [getMatches, setMatches] = createSignal(false);

    const entry: QueryEntry = {
        getMatches,
        setMatches,
        onChange: () => setMatches(entry.list?.matches === true),
        list: undefined,
        count: 0,
    };

    entries.set(query, entry);

    return entry;
};

/** Adds a user to an entry, starting the listener on the first one. */
const subscribe = (query: string, entry: QueryEntry) => {
    entry.count += 1;

    if (entry.count > 1) return;

    entry.list = window.matchMedia(query);
    entry.list.addEventListener("change", entry.onChange);
    entry.onChange();
};

/** Removes a user from an entry, stopping the listener when the last one goes. */
const unsubscribe = (entry: QueryEntry) => {
    entry.count -= 1;

    if (entry.count > 0) return;

    entry.list?.removeEventListener("change", entry.onChange);
    entry.list = undefined;
};

/**
 * Reports whether a media query matches, as a reactive accessor.
 *
 * Components asking for the same query share one `MediaQueryList` and one signal, counted so the
 * listener starts with the first consumer and stops with the last. This matters because reduced
 * motion is asked about by nearly every animated component, and a hundred listeners for one query
 * is a hundred more than are needed.
 */
export namespace MediaQueryMonitorUtils {
    /**
     * Watches a media query.
     *
     * @param query The query text, as it would be written in CSS.
     * @returns Whether it currently matches. `false` until the query is first evaluated, which happens
     * as soon as the effect runs.
     */
    export const create = (query: string) => {
        const entry = getEntry(query);

        createEffect(() => {
            subscribe(query, entry);

            onCleanup(() => {
                unsubscribe(entry);
            });
        });

        return entry.getMatches;
    };

    /**
     * Whether the user has asked for reduced motion.
     *
     * Anything that animates should consult this and offer a still or much shorter alternative — motion
     * can cause real discomfort, and the request is explicit.
     *
     * @returns Whether motion should be reduced.
     */
    export const createReducedMotion = () => create(REDUCED_MOTION_QUERY);
}
