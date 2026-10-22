<script lang="ts">
    import * as styles from "@thewaver/ss-playground/App/StyledComponents/PaginatorContent/PaginatorContent.css";

    import { getLayerClass } from "../Layer/Layer.context";
    import type { PaginatorCountContentProps } from "./PaginatorContentSvelte.types";

    let props: PaginatorCountContentProps = $props();

    const layerClass = $derived.by(getLayerClass());
</script>

<div class={[styles.paginatorCount, layerClass]}>{`${props.page} of ${props.pageCount}`}</div>
