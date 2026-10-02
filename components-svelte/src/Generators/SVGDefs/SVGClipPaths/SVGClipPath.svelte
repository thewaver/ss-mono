<svelte:options namespace="svg" />

<script lang="ts">
    import type { Snippet } from "svelte";

    import { PaintAreaUtils } from "@thewaver/ss-components";

    import { getPaintAreaContext } from "../SVGGradients/PaintArea.context.js";

    let props: { id: string; children?: Snippet } = $props();

    const paintArea = getPaintAreaContext();

    const attributes = $derived(PaintAreaUtils.computeClipPathAttributes(paintArea?.getPaintArea()));
</script>

<clipPath id={props.id} clipPathUnits={attributes.clipPathUnits} transform={attributes.transform}>
    {@render props.children?.()}
</clipPath>
