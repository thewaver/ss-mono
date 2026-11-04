<script lang="ts">
    import * as styles from "@thewaver/ss-playground/App/Pages/SkinsPage/SkinsPage.css";

    import PageLayer from "../../PageComponents/Layer/Layer.svelte";
    import type { SkinSampleColumnProps } from "./SkinsPage.types";

    let props: SkinSampleColumnProps = $props();
</script>

<div class={[styles.skinColumn, props.isWide && styles.skinWideColumn]}>
    <PageLayer level={1}>
        <div class={styles.skinColumnName}>{props.name}</div>

        {@render props.children?.()}
    </PageLayer>
</div>
