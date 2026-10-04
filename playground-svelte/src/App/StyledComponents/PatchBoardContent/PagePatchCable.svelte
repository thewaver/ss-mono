<svelte:options namespace="svg" />

<script lang="ts">
    import { computePatchCablePath } from "@thewaver/ss-playground/App/StyledComponents/PatchBoardContent/PatchBoardContent.const";
    import * as styles from "@thewaver/ss-playground/App/StyledComponents/PatchBoardContent/PatchBoardContent.css";

    import { getLayerClass } from "../Layer/Layer.context";
    import type { PagePatchCableProps } from "./PatchBoardContent.types";

    let props: PagePatchCableProps = $props();

    const layerClass = $derived.by(getLayerClass());
</script>

<path
    class={[
        styles.patchCable,
        layerClass,
        props.defs.isPending && styles.isPending,
        !props.defs.isAllowed && styles.isRefused,
    ]}
    d={computePatchCablePath(props.defs)}
/>
