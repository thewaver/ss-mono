<script lang="ts">
    import * as styles from "@thewaver/ss-playground/App/StyledComponents/DieContent/DieContent.css";

    import { getLayerClass } from "../Layer/Layer.context";
    import type { PageDieFaceProps } from "./DieContent.types";

    const LABEL_SHARE = 0.35;

    let props: PageDieFaceProps = $props();

    const layerClass = $derived.by(getLayerClass());
</script>

<div
    class={[styles.dieFace, layerClass, props.state.isShowing && styles.dieFaceShowing]}
    style:font-size={`${Math.min(props.state.size.width, props.state.size.height) * LABEL_SHARE}px`}
    aria-hidden="true"
>
    {props.label}
</div>
