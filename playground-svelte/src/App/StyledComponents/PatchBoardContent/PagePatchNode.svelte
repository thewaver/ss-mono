<script lang="ts">
    import * as styles from "@thewaver/ss-playground/App/StyledComponents/PatchBoardContent/PatchBoardContent.css";

    import { getLayerClass } from "../Layer/Layer.context";
    import type { PagePatchNodeProps } from "./PatchBoardContent.types";

    let props: PagePatchNodeProps = $props();

    const layerClass = $derived.by(getLayerClass());

    const flags = $derived(props.flags);
</script>

<div
    class={[
        styles.patchNode,
        layerClass,
        flags.isCarried && styles.isCarried,
        flags.isHovered && styles.isHovered,
        flags.isFocusVisible && styles.isFocusVisible,
        flags.isDisabled && styles.isDisabled,
    ]}
>
    <span class={styles.patchNodeName}>{props.label}</span><span class={styles.patchNodeKind}>{props.kind}</span>
</div>
