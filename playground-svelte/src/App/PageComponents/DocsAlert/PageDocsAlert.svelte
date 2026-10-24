<script lang="ts">
    import type { Snippet } from "svelte";

    import * as styles from "@thewaver/ss-playground/App/PageComponents/DocsAlert/DocsAlert.css";

    import { getIsPreview } from "../Preview/Preview.context";

    let props: { children?: Snippet } = $props();

    const isPreview = getIsPreview();
</script>

{#if !isPreview}
    <div class={styles.docsAlertRoot} role="note" data-docs-alert="">
        <div class={styles.docsAlertContent}>
            <div class={styles.docsAlertLogo}>⚠</div>
            {@render props.children?.()}
        </div>
    </div>
{/if}
