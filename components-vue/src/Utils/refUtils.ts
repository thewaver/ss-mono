import { type ComponentPublicInstance, type ComputedRef, type SetupContext, computed } from "vue";

/**
 * The element a template ref was handed, whether it was put on an element or on a component.
 *
 * Vue hands a ref on an element the element, and a ref on a component the component. A library component's `$el`
 * is the element the other frameworks' `ref` points at, so reading it here is what lets one ref callback serve both:
 * a leaf that renders a native element and a leaf that is itself a component are attached the same way.
 *
 * @param target What the ref was handed.
 * @returns The element, or `undefined` when there is none — `null` on unmount, or a component whose `$el` is not an
 * element yet.
 */
export const toElement = <T extends Element = HTMLElement>(
    target: Element | ComponentPublicInstance | null | undefined,
): T | undefined => {
    if (!target) return undefined;

    if (target instanceof Element) return target as T;

    return target.$el instanceof Element ? (target.$el as T) : undefined;
};

/**
 * Makes the component's `$el` the element given, rather than whatever its render put first.
 *
 * Vue reserves `ref`, so a consumer's template ref on a component reaches the component, and its `$el` is how they
 * reach the element. By default that is the component's first rendered node, which is not always the element the
 * component is about — a wrapper's control sits inside its box, and a component that renders a fragment or a
 * teleport starts with a placeholder. This points `$el` at the one that matters.
 *
 * Call it once in `setup`. It uses the component's `expose`, so the component exposes nothing else.
 *
 * @param expose The component's `expose`, from its setup context.
 * @param getElement Answers the element whenever `$el` is read, so it may arrive late and may change.
 */
export const exposeElement = (expose: SetupContext["expose"], getElement: () => Element | null | undefined) => {
    expose({
        get $el() {
            return getElement() ?? null;
        },
    });
};

/**
 * The same array for as long as its entries are the same.
 *
 * A list built afresh each time it is worked out is a new array every time, so anything watching it would run
 * every time. This hands back the previous array while every entry is identical to it, so a watcher runs only when
 * the list really changes.
 *
 * @param getList Works the list out. Read reactively, as a `computed` reads its getter.
 * @returns The list, as a computed ref that changes only when an entry does.
 */
export const useStableList = <T>(getList: () => T[]): ComputedRef<T[]> =>
    computed((previous) => {
        const list = getList();

        if (previous && previous.length === list.length && previous.every((entry, index) => entry === list[index])) {
            return previous;
        }

        return list;
    });
