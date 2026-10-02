<svelte:options namespace="svg" />

<script lang="ts">
    import SVGClipPath from "../../Generators/SVGDefs/SVGClipPaths/SVGClipPath.svelte";
    import Markup from "../../Utils/Markup.svelte";
    import type { SVGSampleClipPathProps } from "./SVGDefsSvelte.types.js";

    let props: SVGSampleClipPathProps = $props();
</script>

<SVGClipPath id={props.id}>
    <Markup markup={props.content} />
</SVGClipPath>
