<script lang="ts">
    import { untrack } from "svelte";

    import * as styles from "@thewaver/ss-playground/App/StyledComponents/Ripple/Ripple.css";

    import type { RippleMark, RippleProps } from "./Ripple.types";

    const RIPPLE_DURATION_MS = 600;
    const RATIO_TO_PERCENT = 100;

    let props: RippleProps = $props();

    let marks = $state.raw<RippleMark[]>([]);

    const timeouts = new Set<ReturnType<typeof setTimeout>>();

    const count = $derived(props.activation?.count);

    const addMark = (mark: RippleMark) => {
        if (!marks.includes(mark)) marks = [...marks, mark];

        const timeout = setTimeout(() => {
            timeouts.delete(timeout);
            marks = marks.filter((entry) => entry !== mark);
        }, RIPPLE_DURATION_MS);

        timeouts.add(timeout);
    };

    $effect(() => {
        if (count === undefined) return;

        const mark = untrack(() => props.activation);

        if (mark === undefined) return;

        untrack(() => addMark(mark));
    });

    $effect(() => () => {
        timeouts.forEach(clearTimeout);
        timeouts.clear();
    });
</script>

<div class={styles.rippleRoot} style:color={props.color} aria-hidden="true">
    {#each marks as mark (mark.count)}
        <div
            class={styles.rippleMark}
            style:left={`${mark.ratio.x * RATIO_TO_PERCENT}%`}
            style:top={`${mark.ratio.y * RATIO_TO_PERCENT}%`}
            style:animation-duration={`${RIPPLE_DURATION_MS}ms`}
        ></div>
    {/each}
</div>
