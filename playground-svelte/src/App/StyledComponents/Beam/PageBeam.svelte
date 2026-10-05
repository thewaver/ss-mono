<svelte:options namespace="svg" />

<script lang="ts">
    import { untrack } from "svelte";

    import {
        computeBeamLengthPx,
        computeBeamMotion,
        observeBeamLength,
    } from "@thewaver/ss-playground/App/StyledComponents/Beam/Beam.const";
    import * as styles from "@thewaver/ss-playground/App/StyledComponents/Beam/Beam.css";

    import type { PageBeamProps } from "./Beam.types";

    const NO_LENGTH = 0;

    let props: PageBeamProps = $props();

    let path = $state<SVGPathElement>();
    let lengthPx = $state(NO_LENGTH);

    $effect(() => {
        if (!path) return;

        return observeBeamLength(path, (value) => {
            lengthPx = value;
        });
    });

    $effect(() => {
        void props.d;

        if (path) lengthPx = computeBeamLengthPx(path);
    });

    $effect(() => {
        const value = lengthPx;

        untrack(() => props.onLengthPx?.(value));
    });

    $effect(() => () => untrack(() => props.onLengthPx?.(undefined)));

    const motion = $derived(
        computeBeamMotion({
            lengthPx,
            startPx: props.routeStartPx ?? NO_LENGTH,
            totalPx: props.routeLengthPx ?? lengthPx,
            direction: props.direction,
        }),
    );

    $effect(() => {
        const { fromPx, toPx, durationMs } = motion;

        if (!path || durationMs <= NO_LENGTH) return;

        const animation = path.animate([{ strokeDashoffset: `${fromPx}px` }, { strokeDashoffset: `${toPx}px` }], {
            duration: durationMs,
            iterations: Infinity,
        });

        animation.currentTime = performance.now() % durationMs;

        if (!props.isPlaying) animation.pause();

        return () => animation.cancel();
    });
</script>

<path bind:this={path} class={styles.beam} style:stroke-dasharray={motion.dashArray} d={props.d} data-beam />
