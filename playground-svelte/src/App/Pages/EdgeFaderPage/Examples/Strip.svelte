<script lang="ts">
    import { EdgeFader } from "@thewaver/ss-components-svelte";
    import { STRIP_CHIPS } from "@thewaver/ss-playground/App/Pages/EdgeFaderPage/EdgeFaderPage.const";
    import * as styles from "@thewaver/ss-playground/App/Pages/EdgeFaderPage/EdgeFaderPage.css";

    import type { EdgeFaderExampleProps } from "../EdgeFaderPage.types";

    let props: EdgeFaderExampleProps = $props();
</script>

<div class={styles.autoHeightFrame}>
    <EdgeFader edges={["left", "right"]} ariaLabel={"Items"} size={props.size} isScrollAware={props.isScrollAware}>
        <div class={styles.strip}>
            {#each STRIP_CHIPS as label (label)}
                <div class={styles.chip}>{label}</div>
            {/each}
        </div>
    </EdgeFader>
</div>
