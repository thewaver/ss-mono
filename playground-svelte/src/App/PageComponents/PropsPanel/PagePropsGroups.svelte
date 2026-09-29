<script lang="ts">
    import type { Snippet } from "svelte";

    import * as styles from "@thewaver/ss-playground/App/PageComponents/PropsPanel/PropsPanel.css";

    let props: { children?: Snippet } = $props();
</script>

<div class={styles.propsGroups}>{@render props.children?.()}</div>
