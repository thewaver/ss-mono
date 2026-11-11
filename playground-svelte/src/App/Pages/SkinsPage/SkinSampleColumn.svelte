<script lang="ts">
    import * as styles from "@thewaver/ss-playground/App/Pages/SkinsPage/SkinsPage.css";

    import PageLayer from "../../PageComponents/Layer/Layer.svelte";
    import { getNextLayerClass } from "../../StyledComponents/Layer/Layer.context";
    import type { SkinSampleColumnProps } from "./SkinsPage.types";

    let props: SkinSampleColumnProps = $props();

    const getNextLayerClassName = getNextLayerClass();
</script>

<div class={[styles.skinColumn, getNextLayerClassName(), props.isWide && styles.skinWideColumn]}>
    <PageLayer>
        <div class={styles.skinColumnName}>{props.name}</div>

        {@render props.children?.()}
    </PageLayer>
</div>
