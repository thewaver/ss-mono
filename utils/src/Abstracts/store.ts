/** Called after a store's value has changed. It is handed nothing; read the store for the new value. */
export type StoreListener = () => void;

/**
 * A value that can be read at any time and that says when it has changed.
 *
 * `get` returns the same reference until the value changes, so two reads can be compared by identity to tell
 * whether anything happened between them. That is also the promise React's `useSyncExternalStore` asks of its
 * snapshot, and what lets a signal fed from a store skip notifying when nothing moved.
 */
export type Store<T> = {
    /** The current value. */
    get: () => T;
    /**
     * Calls `listener` after every change, until the returned function is called.
     *
     * Each call is a subscription of its own: subscribing the same function twice calls it twice, and each returned
     * function ends only its own subscription. Ending one twice is harmless.
     */
    subscribe: (listener: StoreListener) => () => void;
};

/** A {@link Store} its owner can also write. Hand out the {@link Store} half and keep this one. */
export type WritableStore<T> = Store<T> & {
    /**
     * Replaces the value and tells every listener.
     *
     * A value equal to the current one, by the store's own test, changes nothing and tells nobody.
     *
     * @returns `true` when the value changed, `false` when the write was equal to what was there.
     */
    set: (value: T) => boolean;
    /**
     * Replaces the value with one worked out from the current one, under the same rules as `set`.
     *
     * @returns `true` when the value changed.
     */
    update: (update: (current: T) => T) => boolean;
};

export namespace StoreUtils {
    /**
     * Makes a store holding `initial`.
     *
     * Listeners run synchronously, in the order they subscribed, before `set` returns. A listener that subscribes
     * or unsubscribes while being told of a change does not disturb the others: the ones called for a change are
     * the ones subscribed when it happened.
     *
     * @param initial The value the store starts with.
     * @param opts.isEqual Decides whether a write changes anything. `Object.is` by default, which suits a
     * primitive or an object that is replaced rather than edited; pass a shallow comparison for an object rebuilt
     * on every write, so a rebuild with the same fields stays quiet.
     */
    export const create = <T>(initial: T, opts?: { isEqual?: (a: T, b: T) => boolean }): WritableStore<T> => {
        const isEqual = opts?.isEqual ?? Object.is;
        const subscriptions = new Set<{ listener: StoreListener }>();

        let value = initial;

        const set = (next: T) => {
            if (isEqual(value, next)) return false;

            value = next;

            for (const subscription of [...subscriptions]) subscription.listener();

            return true;
        };

        return {
            get: () => value,
            subscribe: (listener) => {
                const subscription = { listener };

                subscriptions.add(subscription);

                return () => {
                    subscriptions.delete(subscription);
                };
            },
            set,
            update: (update) => set(update(value)),
        };
    };

    /**
     * Whether two objects hold the same value under every key, compared with `Object.is`.
     *
     * The comparison to hand {@link StoreUtils.create} for a store whose value is a record rebuilt on each write.
     * It looks one level deep only: two fields holding different arrays with the same contents differ.
     */
    export const getIsShallowEqual = <T extends object>(a: T, b: T) => {
        if (Object.is(a, b)) return true;

        const keys = Object.keys(a) as (keyof T)[];

        if (keys.length !== Object.keys(b).length) return false;

        return keys.every((key) => Object.prototype.hasOwnProperty.call(b, key) && Object.is(a[key], b[key]));
    };
}
