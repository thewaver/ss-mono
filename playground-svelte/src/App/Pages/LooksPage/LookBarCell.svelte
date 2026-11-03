<script lang="ts">
    import * as styles from "@thewaver/ss-playground/App/Pages/LooksPage/LooksPage.css";

    import type { LookBarCellProps } from "./LooksPage.types";

    let props: LookBarCellProps = $props();
</script>

<div class={styles.lookBarCell}>
    <div class={styles.lookBarCaption}>{props.state}</div>

    {@render props.children?.()}
</div>
