<script lang="ts">
    import * as styles from "@thewaver/ss-playground/App/StyledComponents/IcicleContent/IcicleContent.css";

    import { getLayerClass } from "../Layer/Layer.context";
    import type { PageIcicleCellProps } from "./IcicleContent.types";

    const MIN_LABEL_HEIGHT = 16;
    const LABEL_SHOWN = 1;
    const LABEL_HIDDEN = 0;

    let props: PageIcicleCellProps = $props();

    const layerClass = $derived.by(getLayerClass());
</script>

<div
    class={[
        `${styles.icicleCell} ${props.family === undefined ? styles.icicleCellRoot : styles.icicleCellFamily[props.family]}`,
        layerClass,
    ]}
    title={props.title}
>
    <span
        class={styles.icicleLabel}
        style:opacity={props.state.rect.height > MIN_LABEL_HEIGHT ? LABEL_SHOWN : LABEL_HIDDEN}
    >
        {props.name} <span class={styles.icicleWeight}>{props.weight}</span>
    </span>
</div>
