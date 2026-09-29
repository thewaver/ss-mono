<script lang="ts">
    import type { Snippet } from "svelte";

    import * as styles from "@thewaver/ss-playground/App/StyledComponents/ColorAreaContent/ColorAreaContent.css";

    import { getLayerClass } from "../Layer/Layer.context";

    let props: { label: string; children?: Snippet } = $props();

    const layerClass = $derived.by(getLayerClass());
</script>

<div class={[styles.colorChannel, layerClass]}>
    <div class={styles.colorChannelLabel} aria-hidden="true">
        {props.label}
    </div>

    {@render props.children?.()}
</div>
