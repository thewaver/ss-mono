<script lang="ts">
    import * as styles from "@thewaver/ss-playground/App/Pages/LooksPage/LooksPage.css";

    import PageLayer from "../../PageComponents/Layer/Layer.svelte";
    import type { LookSampleColumnProps } from "./LooksPage.types";

    let props: LookSampleColumnProps = $props();
</script>

<div class={[styles.lookColumn, props.isWide && styles.lookWideColumn]}>
    <PageLayer level={1}>
        <div class={styles.lookColumnName}>{props.name}</div>

        {@render props.children?.()}
    </PageLayer>
</div>
