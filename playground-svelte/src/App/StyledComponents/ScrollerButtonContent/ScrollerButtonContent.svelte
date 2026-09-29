<script lang="ts">
    import * as styles from "@thewaver/ss-playground/App/StyledComponents/ScrollerButtonContent/ScrollerButtonContent.css";

    import { getLayerClass } from "../Layer/Layer.context";
    import type { ScrollerButtonContentProps } from "./ScrollerButtonContent.types";

    let props: ScrollerButtonContentProps = $props();

    const layerClass = $derived.by(getLayerClass());
</script>

<div
    class={[
        styles.scrollerButton,
        layerClass,
        props.flags.isHovered && styles.isHovered,
        props.flags.isActive && styles.isActive,
        props.flags.isDisabled && styles.isDisabled,
    ]}
    aria-hidden="true"
>
    {props.step === "previous" ? "‹" : "›"}
</div>
