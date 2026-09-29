import { untrack } from "svelte";
/**
 * Calls `onChange` each time a reading changes, and not for the value it starts at.
 *
 * Svelte's own effects run once as they are set up, where a value arriving from outside usually has to be told
 * apart from the value the component started with — a consumer turning a wheel to a new index, a placement moving
 * an item. This reads `getValue` in an effect and calls `onChange` only when the answer differs from the last one,
 * by `Object.is`, so a getter that re-runs for an unrelated reason calls nothing. `onChange` runs untracked, so
 * whatever it reads does not become something to watch.
 *
 * Must run while a component is being set up, or inside `$effect.root`, and stops with it.
 *
 * @param getValue The reading to watch.
 * @param onChange Called with the new reading and the one before it.
 * @param opts.isBeforeRender Calls `onChange` before the markup is updated for the new reading rather than after,
 * so state it writes reaches the page in the same update — what an item needs to start a transition in the same
 * frame as it moves.
 */
export const watchChange = (getValue, onChange, opts) => {
    let last;
    const run = () => {
        const value = getValue();
        if (last === undefined) {
            last = { value };
            return;
        }
        if (Object.is(value, last.value))
            return;
        const previous = last.value;
        last = { value };
        untrack(() => onChange(value, previous));
    };
    if (opts?.isBeforeRender) {
        $effect.pre(run);
    }
    else {
        $effect(run);
    }
};
