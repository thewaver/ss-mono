import { type RefObject, useLayoutEffect, useRef, useState } from "react";

/**
 * The element a ref points at, as state, so an effect can depend on it.
 *
 * A ref's `current` changes without React noticing, so an effect that reads it runs against whatever the ref held
 * when the effect last ran. This reads the ref after every render and re-renders only when it points somewhere new,
 * which is what lets a hook attach its listeners when the element arrives, move them when it changes, and drop them
 * when it goes.
 *
 * @param ref The ref to follow. Missing reads as no element.
 * @returns The element, or `undefined` before it exists and after it is gone. It lags the ref by one commit.
 */
export const useElement = <T extends Element>(ref: RefObject<T | null> | undefined): T | undefined => {
    const [element, setElement] = useState<T>();

    useLayoutEffect(() => {
        const current = ref?.current ?? undefined;

        if (current !== element) setElement(current);
    });

    return element;
};

/**
 * A ref that always holds the value from the latest render.
 *
 * For a framework-free object made once but handed functions it calls later: the functions read through this ref,
 * so the object sees each render's options and callbacks without being made again. The ref is updated as the render
 * commits, so a call made during rendering still sees the previous render's value.
 *
 * @param value This render's value.
 * @returns The ref.
 */
export const useLatest = <T>(value: T) => {
    const ref = useRef(value);

    useLayoutEffect(() => {
        ref.current = value;
    });

    return ref;
};

/**
 * The same array from render to render for as long as its entries are the same.
 *
 * A list built inline is a new array every render, so an effect depending on it would run every render. This hands
 * back the previous array while every entry is identical to it, so the effect runs only when the list really
 * changes.
 *
 * @param list This render's list.
 * @returns This render's list, or the previous one when nothing in it changed.
 */
export const useStableList = <T>(list: T[]): T[] => {
    const ref = useRef(list);

    if (
        ref.current !== list &&
        !(ref.current.length === list.length && ref.current.every((entry, index) => entry === list[index]))
    ) {
        ref.current = list;
    }

    return ref.current;
};
