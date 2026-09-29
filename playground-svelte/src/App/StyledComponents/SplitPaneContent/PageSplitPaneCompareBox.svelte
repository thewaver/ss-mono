<script lang="ts">
    import * as styles from "@thewaver/ss-playground/App/StyledComponents/SplitPaneContent/SplitPaneContent.css";

    import { getLayerClass } from "../Layer/Layer.context";
    import type { SplitPaneCompareProps } from "./SplitPaneContent.types";

    let props: SplitPaneCompareProps = $props();

    const layerClass = $derived.by(getLayerClass());
</script>

<div class={[styles.compareBox, layerClass]}>
    <img
        class={props.side === "start" ? styles.compareStartImage : styles.compareEndImage}
        src={props.src}
        alt={props.alt}
    />
</div>
