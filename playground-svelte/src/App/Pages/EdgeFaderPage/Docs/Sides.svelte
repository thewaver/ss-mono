<script lang="ts">
    import { EdgeFader } from "@thewaver/ss-components-svelte";
    import { GRID_TILES } from "@thewaver/ss-playground/App/Pages/EdgeFaderPage/EdgeFaderPage.const";
    import * as styles from "@thewaver/ss-playground/App/Pages/EdgeFaderPage/EdgeFaderPage.css";

    import type { EdgeFaderSidesDocsExampleProps } from "../EdgeFaderPageSvelte.types";

    type Props = EdgeFaderSidesDocsExampleProps;

    let props: Props = $props();
</script>

<div class={styles.frame}>
    <EdgeFader edges={props.edges} ariaLabel={"Tiles"}>
        <div class={styles.grid}>
            {#each GRID_TILES as label (label)}
                <div class={styles.tile}>{label}</div>
            {/each}
        </div>
    </EdgeFader>
</div>
