<script lang="ts">
    import { EdgeFader } from "@thewaver/ss-components-svelte";
    import { COLUMN_ROWS } from "@thewaver/ss-playground/App/Pages/EdgeFaderPage/EdgeFaderPage.const";
    import * as styles from "@thewaver/ss-playground/App/Pages/EdgeFaderPage/EdgeFaderPage.css";

    import type { EdgeFaderExampleProps } from "../EdgeFaderPage.types";

    let props: EdgeFaderExampleProps = $props();
</script>

<div class={styles.frame}>
    <EdgeFader edges={["top", "bottom"]} ariaLabel={"Rows"} size={props.size} isScrollAware={props.isScrollAware}>
        <div class={styles.column}>
            {#each COLUMN_ROWS as label (label)}
                <div class={styles.row}>{label}</div>
            {/each}
        </div>
    </EdgeFader>
</div>
