<script lang="ts">
    import type { Snippet } from "svelte";

    import * as styles from "@thewaver/ss-playground/App/StyledComponents/TableContent/TableContent.css";

    let props: { children?: Snippet } = $props();
</script>

<div class={styles.tableHeaderText}>{@render props.children?.()}</div>
