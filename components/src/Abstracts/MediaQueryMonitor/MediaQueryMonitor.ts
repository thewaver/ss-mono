import { type Accessor, type Setter, createEffect, createSignal, onCleanup } from "solid-js";

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

type QueryEntry = {
    getMatches: Accessor<boolean>;
    setMatches: Setter<boolean>;
    onChange: () => void;
    list: MediaQueryList | undefined;
    count: number;
};

const entries = new Map<string, QueryEntry>();

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

const subscribe = (query: string, entry: QueryEntry) => {
    entry.count += 1;

    if (entry.count > 1) return;

    entry.list = window.matchMedia(query);
    entry.list.addEventListener("change", entry.onChange);
    entry.onChange();
};

const unsubscribe = (entry: QueryEntry) => {
    entry.count -= 1;

    if (entry.count > 0) return;

    entry.list?.removeEventListener("change", entry.onChange);
    entry.list = undefined;
};

export namespace MediaQueryMonitor {
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

    export const createReducedMotion = () => create(REDUCED_MOTION_QUERY);
}
