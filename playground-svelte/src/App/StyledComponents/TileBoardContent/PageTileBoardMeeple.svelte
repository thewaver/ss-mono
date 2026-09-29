<script lang="ts">
    import * as styles from "@thewaver/ss-playground/App/StyledComponents/TileBoardContent/TileBoardContent.css";

    import { getLayerClass } from "../Layer/Layer.context";
    import type { PageTileBoardMeepleProps } from "./TileBoardContent.types";

    const MEEPLE_WIDTH_RATIO = 0.56;

    let props: PageTileBoardMeepleProps = $props();

    const layerClass = $derived.by(getLayerClass());
</script>

<div
    class={[styles.tileBoardMeeple, layerClass]}
    style:left={`${props.center.x}px`}
    style:top={`${props.center.y}px`}
    style:width={`${props.tileSize.width * MEEPLE_WIDTH_RATIO * props.scale}px`}
    data-meeple=""
    aria-hidden={"true"}
></div>
