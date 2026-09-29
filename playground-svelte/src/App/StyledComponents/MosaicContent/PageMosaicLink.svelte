<script lang="ts">
    import type { Snippet } from "svelte";

    import * as styles from "@thewaver/ss-playground/App/StyledComponents/MosaicContent/MosaicContent.css";

    import { getLayerClass } from "../Layer/Layer.context";
    import type { PageMosaicLinkProps } from "./MosaicContent.types";

    let props: PageMosaicLinkProps & { children?: Snippet } = $props();

    const layerClass = $derived.by(getLayerClass());
</script>

<a class={[styles.mosaicLink, layerClass]} href={props.href}>
    {@render props.children?.()}<span class={styles.mosaicCaption}>{props.caption}</span>
</a>
