import type { Component, Snippet } from "svelte";

/**
 * A value owned somewhere else, handed over as the function that reads it and the function that writes it.
 *
 * The Svelte spelling of two-way state inside the library: a component holding a `$bindable` prop passes
 * `[() => value, (next) => (value = next)]`, so a helper can read the owner's value and write it back without
 * holding a copy. Reads go through the getter every time, so a helper that reads inside an effect follows the
 * owner, and a write the owner refuses leaves the getter answering what the owner kept.
 */
export type ValuePair<T> = [get: () => T, set: (value: T) => void];

/**
 * A component together with the props to draw it with, as a value that can be stored, returned and drawn later.
 *
 * A function in the Svelte package that builds markup — a gradient, a filter, a pattern — answers one of these where
 * the React package answers an element, and the `Markup` component draws it. Build one with `markup`, which checks
 * the props against the component.
 */
export type MarkupElement<TProps extends Record<string, any> = any> = {
    /** The component to draw. */
    component: Component<TProps>;
    /** The props it is drawn with. */
    props: TProps;
};

/**
 * A snippet taking no arguments, held as a value beside {@link MarkupElement}.
 *
 * The snippet goes inside an object because markup is never a function, which is what lets a parameter take either
 * markup or a function that builds it — a gradient's `custom`, which may need the gradient's endpoints — and tell the
 * two apart. Write `{ snippet: mySnippet }`.
 */
export type MarkupSnippet = {
    /** The snippet to render. */
    snippet: Snippet;
};

/**
 * Markup held as a value: what the Svelte package hands around wherever the React package hands a `ReactNode`.
 *
 * It is one of a {@link MarkupElement}, a {@link MarkupSnippet}, a list of either, or nothing at all — `undefined`,
 * `null` and `false` draw nothing, so a value can be left out with `&&` as in JSX. It is never a function. Draw it
 * with the `Markup` component.
 */
export type SvelteMarkup = MarkupElement | MarkupSnippet | readonly SvelteMarkup[] | false | null | undefined;

/** The props of the `Markup` component. */
export type MarkupProps = {
    /** What to draw. A list is drawn in order, and anything empty draws nothing. */
    markup: SvelteMarkup;
};
