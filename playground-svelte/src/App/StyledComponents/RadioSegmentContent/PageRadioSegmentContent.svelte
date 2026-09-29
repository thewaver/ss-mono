<script lang="ts">
    import type { Snippet } from "svelte";

    import * as styles from "@thewaver/ss-playground/App/StyledComponents/RadioSegmentContent/RadioSegmentContent.css";

    import { getLayerClass } from "../Layer/Layer.context";
    import type { RadioSegmentContentProps } from "./RadioSegmentContent.types";

    let props: RadioSegmentContentProps & { children?: Snippet } = $props();

    const layerClass = $derived.by(getLayerClass());
</script>

<div
    class={[
        styles.segmentContent,
        layerClass,
        props.flags.checkedState === true && styles.isChecked,
        props.flags.isHovered && styles.isHovered,
        props.flags.isDisabled && styles.isDisabled,
        props.flags.hasError && styles.hasError,
    ]}
>
    {@render props.children?.()}
</div>
