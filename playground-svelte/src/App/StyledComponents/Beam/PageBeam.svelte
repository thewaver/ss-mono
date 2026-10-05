<svelte:options namespace="svg" />

<script lang="ts">
    import { toStyle } from "@thewaver/ss-components-svelte";
    import { computeBeamLengthPx, observeBeamLength } from "@thewaver/ss-playground/App/StyledComponents/Beam/Beam.const";
    import * as styles from "@thewaver/ss-playground/App/StyledComponents/Beam/Beam.css";
    import { assignInlineVars } from "@vanilla-extract/dynamic";

    import type { PageBeamProps } from "./Beam.types";

    let props: PageBeamProps = $props();

    let path = $state<SVGPathElement>();
    let lengthPx = $state(0);

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
</script>

<path
    bind:this={path}
    class={[styles.beam, styles.beamDirectionVariants[props.direction], !props.isPlaying && styles.beamPaused]}
    style={toStyle(assignInlineVars({ [styles.beamLengthVar]: `${lengthPx}px` }))}
    d={props.d}
    data-beam
/>
