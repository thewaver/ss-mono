<script lang="ts">
    import * as styles from "@thewaver/ss-playground/App/Pages/SVGGradients/SVGGradients.css";

    import { TRACKED_CELLS } from "@thewaver/ss-playground/App/Pages/SVGGradients/SVGGradients.const";
    import type { TrackedGradientExampleProps } from "../../SVGGradientsSvelte.types";
    import TrackedShape from "./TrackedShape.svelte";

    let props: TrackedGradientExampleProps = $props();
</script>

<div class={styles.trackedGrid}>
    {#each TRACKED_CELLS as cell (cell)}
        <TrackedShape {...props} boxClass={styles.trackedCell} />
    {/each}
</div>
