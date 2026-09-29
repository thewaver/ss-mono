import type { Accessor, Signal } from "solid-js";

/** A type with `undefined` and `null` removed. */
type NonNullish<T> = T extends undefined | null ? never : T;

/**
 * Whether a prop should be left as it is rather than being allowed to arrive as an accessor.
 *
 * Functions, symbols and signals are values in their own right; wrapping them would make a callback
 * and an accessor returning a callback indistinguishable.
 */
type IsSkippable<T> =
    NonNullish<T> extends ((...args: any) => any) | symbol | Signal<any> | SignalPair<any> ? true : false;

/** Whether a key may be left out of the type it belongs to. */
type IsOptional<T, K extends keyof T> = {} extends Pick<T, K> ? true : false;

/** A value given either directly or as an accessor. Read it with `access`. */
export type MaybeAccessor<T> = T | Accessor<T>;

/** A getter and a setter, without Solid's setter overloads — what a consumer can supply by hand. */
export type SignalPair<T> = [get: () => T, set: (value: T) => void];

/** Either a Solid signal or a plain getter-and-setter pair. */
export type SignalSource<T> = Signal<T> | SignalPair<T>;

/**
 * A props type where every value may also be given as an accessor.
 *
 * This is how a component's props are declared: written once as plain values, and this makes each of
 * them accept a function too. Callbacks and signals are left alone, since wrapping them would be
 * ambiguous, and an optional prop keeps its optionality while losing `undefined` from what the
 * accessor may return — an accessor that might return nothing is the same thing as no accessor, and
 * allowing both makes the type unreadable.
 */
export type AccessorProps<T extends object> = {
    [K in keyof T]: IsSkippable<T[K]> extends true
        ? T[K]
        : IsOptional<T, K> extends true
          ? MaybeAccessor<Exclude<T[K], undefined>>
          : MaybeAccessor<T[K]>;
};
