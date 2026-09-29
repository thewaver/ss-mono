<script lang="ts">
    import { EdgeFader } from "@thewaver/ss-components-svelte";
    import { GRID_TILES } from "@thewaver/ss-playground/App/Pages/EdgeFaderPage/EdgeFaderPage.const";
    import * as styles from "@thewaver/ss-playground/App/Pages/EdgeFaderPage/EdgeFaderPage.css";

    import type { EdgeFaderExampleProps } from "../EdgeFaderPage.types";

    let props: EdgeFaderExampleProps = $props();
</script>

<div class={styles.frame}>
    <EdgeFader ariaLabel={"Tiles"} size={props.size} isScrollAware={props.isScrollAware}>
        <div class={styles.grid}>
            {#each GRID_TILES as label (label)}
                <div class={styles.tile}>{label}</div>
            {/each}
        </div>
    </EdgeFader>
</div>
