<script lang="ts">
    import * as styles from "@thewaver/ss-playground/App/StyledComponents/IcicleContent/IcicleContent.css";

    import { getLayerClass } from "../Layer/Layer.context";
    import type { PageIcicleCellProps } from "./IcicleContentSvelte.types";
    import {
        LABEL_HIDDEN,
        LABEL_SHOWN,
        MIN_LABEL_HEIGHT,
    } from "@thewaver/ss-playground/App/StyledComponents/IcicleContent/IcicleContent.const";

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
