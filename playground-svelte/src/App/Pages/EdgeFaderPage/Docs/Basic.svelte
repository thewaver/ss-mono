<script lang="ts">
    import { EdgeFader } from "@thewaver/ss-components-svelte";
    import { COLUMN_ROWS } from "@thewaver/ss-playground/App/Pages/EdgeFaderPage/EdgeFaderPage.const";
    import * as styles from "@thewaver/ss-playground/App/Pages/EdgeFaderPage/EdgeFaderPage.css";

    import type { EdgeFaderBasicDocsExampleProps } from "../EdgeFaderPageSvelte.types";

    type Props = EdgeFaderBasicDocsExampleProps;

    let props: Props = $props();
</script>

<div class={styles.frame}>
    <EdgeFader edges={["top", "bottom"]} size={props.size} ariaLabel={"Rows"}>
        <div class={styles.column}>
            {#each COLUMN_ROWS as label (label)}
                <div class={styles.row}>{label}</div>
            {/each}
        </div>
    </EdgeFader>
</div>
