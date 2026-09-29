<script lang="ts">
    import * as styles from "@thewaver/ss-playground/App/StyledComponents/SplitPaneContent/SplitPaneContent.css";

    import { getLayerClass } from "../Layer/Layer.context";
    import type { SplitPaneGutterProps } from "./SplitPaneContent.types";

    let props: SplitPaneGutterProps = $props();

    const layerClass = $derived.by(getLayerClass());
</script>

<div
    class={[
        props.orientation === "horizontal" ? styles.rowGutter : styles.columnGutter,
        layerClass,
        props.flags.isDragging && styles.isDragging,
        props.flags.isDisabled && styles.isDisabled,
    ]}
    data-gutter=""
>
    <div class={props.orientation === "horizontal" ? styles.rowGrip : styles.columnGrip}></div>
</div>
