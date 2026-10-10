<script lang="ts">
    import type { Snippet } from "svelte";

    import * as styles from "@thewaver/ss-playground/App/PageComponents/PropsPanel/PropsPanel.css";

    import { getIsPreview } from "../Preview/Preview.context";

    let props: { children?: Snippet } = $props();

    const isPreview = getIsPreview();
</script>

{#if !isPreview}
    <div class={styles.propsGroups}>{@render props.children?.()}</div>
{/if}
