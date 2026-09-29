<svelte:options namespace="svg" />

<script lang="ts">
    import SVGAnimateGroup from "./SVGAnimateGroup.svelte";
    import type { SVGAnimatedPathProps } from "./SVGAnimationsSvelte.types.js";

    let props: SVGAnimatedPathProps = $props();

    const tracks = $derived([{ attributeName: "d", values: props.paths.join(";") }]);
</script>

<path d={props.paths[0]}>
    <SVGAnimateGroup {tracks} defs={props.defs} />
</path>
