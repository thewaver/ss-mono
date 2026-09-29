import { type WatchSource, getCurrentInstance, onMounted, onScopeDispose, toValue, watch } from "vue";

/** What each watched source reads as. */
type WatchedValues<TSources extends readonly WatchSource[]> = {
    [K in keyof TSources]: TSources[K] extends WatchSource<infer V> ? V : never;
};

/**
 * Runs an effect once the component has rendered, and again after any render in which one of its sources changed.
 *
 * The effect sees the document as it stands after the render — elements attached, attributes written — so it can
 * measure, focus or attach listeners. It may answer a cleanup, which runs before the effect runs again and when the
 * component unmounts. Only the sources are tracked: whatever the effect itself reads is read as it stands, so a
 * callback prop or an option read inside it is always the current one without ever making it run again.
 *
 * The first run waits for the component to mount; called anywhere else — an effect scope of the caller's own, or a
 * component already mounted — it runs straight away.
 *
 * Must run inside a component's `setup` or another effect scope, whose disposal stops it.
 *
 * @param sources What the effect follows: refs, or getters reading reactive state. Each is compared with
 * `Object.is`, so a getter answering a new array or object every time counts as a change every time — follow a
 * list through `useStableList`.
 * @param effect The effect, handed the sources' current values in the same order.
 * @returns A function that stops the effect, running its cleanup.
 */
export const watchAfterRender = <const TSources extends readonly WatchSource[]>(
    sources: TSources,
    effect: (values: WatchedValues<TSources>) => (() => void) | void,
) => {
    let cleanup: (() => void) | void;
    let hasStarted = false;

    const run = (values: WatchedValues<TSources>) => {
        cleanup?.();
        cleanup = effect(values);
    };

    const stopWatching = watch(
        sources as unknown as WatchSource[],
        (values) => {
            if (hasStarted) run(values as WatchedValues<TSources>);
        },
        { flush: "post" },
    );

    const start = () => {
        hasStarted = true;
        run(sources.map((source) => toValue(source)) as WatchedValues<TSources>);
    };

    const stop = () => {
        stopWatching();
        cleanup?.();
        cleanup = undefined;
    };

    if (getCurrentInstance()?.isMounted === false) {
        onMounted(start);
    } else {
        start();
    }

    onScopeDispose(stop);

    return stop;
};
