import { StoreUtils, type WritableStore } from "@thewaver/ss-utils";

import type { MediaQueryWatcher } from "./MediaQueryMonitor.types";

/** The query for a user who has asked their system to reduce animation. */
const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

type QueryEntry = {
    store: WritableStore<boolean>;
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

    const store = StoreUtils.create(false);

    const entry: QueryEntry = {
        store,
        onChange: () => store.set(entry.list?.matches === true),
        list: undefined,
        count: 0,
    };

    entries.set(query, entry);

    return entry;
};

/** Adds a user to an entry, starting the listener on the first one. */
const join = (query: string, entry: QueryEntry) => {
    entry.count += 1;

    if (entry.count > 1) return;

    entry.list = window.matchMedia(query);
    entry.list.addEventListener("change", entry.onChange);
    entry.onChange();
};

/** Removes a user from an entry, stopping the listener when the last one goes. */
const leave = (entry: QueryEntry) => {
    entry.count -= 1;

    if (entry.count > 0) return;

    entry.list?.removeEventListener("change", entry.onChange);
    entry.list = undefined;
};

/**
 * Reports whether a media query matches, kept current as the page changes.
 *
 * Everything asking about the same query shares one `MediaQueryList` and one store, counted so the
 * listener starts with the first consumer and stops with the last. This matters because reduced
 * motion is asked about by nearly every animated component, and a hundred listeners for one query
 * is a hundred more than are needed.
 */
export namespace MediaQueryMonitorUtils {
    /**
     * Watches a media query.
     *
     * The watcher is a store of whether the query matches, shared with every other watcher of the same query.
     * It listens only between `observe` and the function `observe` returns; outside that it holds whatever it
     * last heard, which is `false` before anybody has observed the query at all. Each `observe` joins the count
     * once, and ending the same one twice is harmless.
     *
     * @param query The query text, as it would be written in CSS.
     * @returns The watcher.
     */
    export const create = (query: string): MediaQueryWatcher => {
        const entry = getEntry(query);

        return {
            get: entry.store.get,
            subscribe: entry.store.subscribe,
            observe: () => {
                let hasLeft = false;

                join(query, entry);

                return () => {
                    if (hasLeft) return;

                    hasLeft = true;
                    leave(entry);
                };
            },
        };
    };

    /**
     * Watches whether the user has asked for reduced motion.
     *
     * Anything that animates should consult this and offer a still or much shorter alternative — motion
     * can cause real discomfort, and the request is explicit.
     *
     * @returns The watcher, as {@link create} gives it.
     */
    export const createReducedMotion = () => create(REDUCED_MOTION_QUERY);
}
