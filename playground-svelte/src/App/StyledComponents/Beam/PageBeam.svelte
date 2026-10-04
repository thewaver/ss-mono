<svelte:options namespace="svg" />

<script lang="ts">
    import * as styles from "@thewaver/ss-playground/App/StyledComponents/Beam/Beam.css";

    import type { PageBeamProps } from "./Beam.types";

    let props: PageBeamProps = $props();
</script>

<path
    class={[styles.beam, styles.beamDirectionVariants[props.direction], !props.isPlaying && styles.beamPaused]}
    d={props.d}
    pathLength={1}
    data-beam
/>
