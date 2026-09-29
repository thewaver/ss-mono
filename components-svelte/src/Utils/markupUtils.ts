import type { Component } from "svelte";

import type { MarkupElement } from "./typeUtils.js";

/**
 * Holds a component and its props as a value, to be drawn later by the `Markup` component.
 *
 * The way a function in the Svelte package returns markup, where the React package would return an element.
 * The props are checked against the component's own, so a mistake shows where the value is built rather than
 * where it is drawn. Drawing the same component again with new props updates it in place rather than mounting
 * it afresh.
 *
 * @param component The component to draw.
 * @param props The props to draw it with.
 * @returns The value, ready to hand to `Markup` or to put in a list with others.
 */
export const markup = <TProps extends Record<string, any>>(
    component: Component<TProps>,
    props: TProps,
): MarkupElement<TProps> => ({ component, props });
