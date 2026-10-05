<script lang="ts">
    import * as styles from "@thewaver/ss-playground/App/Pages/BracketPage/BracketPage.css";

    let props: { names: string[]; layer: number; isPinned?: boolean; isCurrent?: boolean } = $props();
</script>

<div class={[styles.layerHeader, props.isPinned && styles.pinnedLayerHeader, props.isCurrent && styles.layerHeaderCurrent]}>
    {props.names[props.layer]}
</div>
