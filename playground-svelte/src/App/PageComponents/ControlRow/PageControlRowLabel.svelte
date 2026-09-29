<script lang="ts">
    import type { Snippet } from "svelte";

    import * as styles from "@thewaver/ss-playground/App/PageComponents/ControlRow/ControlRow.css";

    let props: { children?: Snippet } = $props();
</script>

<div class={styles.controlRowLabel}>{@render props.children?.()}</div>
