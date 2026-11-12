<script lang="ts">
    import * as styles from "@thewaver/ss-playground/App/Pages/AppearancePage/AppearancePage.css";

    import type { SkinBarCellProps } from "./AppearancePage.types";

    let props: SkinBarCellProps = $props();
</script>

<div class={styles.skinBarCell}>
    <div class={styles.skinBarCaption}>{props.state}</div>

    {@render props.children?.()}
</div>
