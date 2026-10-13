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

/** A value given either directly or as an accessor. Read it with `access`. */
export type MaybeAccessor<T> = T | Accessor<T>;

/** A getter and a setter, without Solid's setter overloads — what a consumer can supply by hand. */
export type SignalPair<T> = [get: () => T, set: (value: T) => void];

/** Either a Solid signal or a plain getter-and-setter pair. */
export type SignalSource<T> = Signal<T> | SignalPair<T>;

/**
 * A component's shared values, each of which may also be given as an accessor.
 *
 * The Solid side of a `Base*Values` type from the core. Unlike {@link AccessorProps} it never looks at what a value
 * is, so it works whatever the value mentions — a type parameter included — and it keeps `undefined` in what an
 * accessor may return, so an optional prop can be switched off from inside an accessor. It is meant only for a
 * values half, which holds no callbacks; those live in the `Base*Cbs` half and are taken as they are.
 */
export type AccessorValues<T extends object> = {
    [K in keyof T]: MaybeAccessor<T[K]>;
};

/**
 * A props type where every value may also be given as an accessor.
 *
 * How a Solid-only props type is declared: written once as plain values, and this makes each of them accept a
 * function too. Callbacks and signals are left alone, since wrapping them would be ambiguous. An optional prop's
 * accessor may return `undefined`, as {@link AccessorValues}' does, so a value handed on from a component's shared
 * props fits, and a consumer can switch an optional setting off from inside an accessor.
 */
export type AccessorProps<T extends object> = {
    [K in keyof T]: IsSkippable<T[K]> extends true ? T[K] : MaybeAccessor<T[K]>;
};
