<script lang="ts">
    import type { Snippet } from "svelte";

    import * as styles from "@thewaver/ss-playground/App/StyledComponents/BreadcrumbContent/BreadcrumbContent.css";

    import { getLayerClass } from "../Layer/Layer.context";

    let props: { children?: Snippet } = $props();

    const layerClass = $derived.by(getLayerClass());
</script>

<span class={[styles.breadcrumbSeparator, layerClass]}>{#if props.children}{@render props.children()}{:else}/{/if}</span>
