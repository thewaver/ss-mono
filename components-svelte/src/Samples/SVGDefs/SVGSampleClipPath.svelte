<svelte:options namespace="svg" />

<script lang="ts">
    import Markup from "../../Utils/Markup.svelte";
    import type { SVGSampleClipPathProps } from "./SVGDefsSvelte.types.js";

    let props: SVGSampleClipPathProps = $props();
</script>

<clipPath id={props.id} clipPathUnits="objectBoundingBox">
    <Markup markup={props.content} />
</clipPath>
