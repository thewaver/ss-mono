<script lang="ts">
    import * as styles from "@thewaver/ss-playground/App/StyledComponents/TabContent/TabContent.css";

    import { getLayerClass } from "../Layer/Layer.context";
    import type { TabDecorationProps } from "./TabContent.types";

    let props: TabDecorationProps = $props();

    const layerClass = $derived.by(getLayerClass());
</script>

<div class={[props.orientation === "horizontal" ? styles.rowTabGutter : undefined, layerClass]} data-gutter=""></div>
