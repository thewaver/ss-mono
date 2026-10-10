<script lang="ts">
    import * as styles from "@thewaver/ss-playground/App/PageComponents/PropsPanel/PropsPanel.css";

    import { getIsPreview } from "../Preview/Preview.context";

    const isPreview = getIsPreview();
</script>

{#if !isPreview}
    <div class={styles.propsPanelDivider} role={"separator"}></div>
{/if}
