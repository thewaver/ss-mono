<svelte:options namespace="svg" />

<script lang="ts">
    import { SVGUtils } from "@thewaver/ss-utils";

    import SVGClipPath from "../SVGClipPaths/SVGClipPath.svelte";
    import type { SVGStyleClipProps } from "./SVGStyleDefsSvelte.types.js";

    let props: SVGStyleClipProps = $props();
</script>

<SVGClipPath id={props.clip.id}>
    {#each props.clip.polygons as points, index (index)}
        <polygon points={SVGUtils.pointArrayToString(points)} />
    {/each}
</SVGClipPath>
