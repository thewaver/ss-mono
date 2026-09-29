<script lang="ts">
    import type { Snippet } from "svelte";

    import * as styles from "@thewaver/ss-playground/App/StyledComponents/SidebarContent/SidebarContent.css";

    let props: { children?: Snippet } = $props();
</script>

<div class={styles.sidebarNeighbor}>{@render props.children?.()}</div>
