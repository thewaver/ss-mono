<script lang="ts">
    import * as styles from "@thewaver/ss-playground/App/PageComponents/CodeBox/CodeBox.css";

    import type { PageCodeBoxProps } from "./CodeBoxSvelte.types";

    let props: PageCodeBoxProps = $props();
</script>

<div class={styles.codeBoxRoot}>
    <div class={styles.codeBoxContent}>{@html props.source}</div>
</div>
