<svelte:options namespace="svg" />

<script lang="ts">
    import { SVGAnimationDefsSvelteUtils } from "../../Generators/SVGDefs/SVGAnimations/SVGAnimationDefsSvelte.utils.svelte.js";
    import type { SVGAnimateGroupProps } from "./SVGAnimationsSvelte.types.js";

    let props: SVGAnimateGroupProps = $props();

    const animate = SVGAnimationDefsSvelteUtils.createAnimateDefs(() => props.defs);
</script>

{#key animate.getKey()}
    {#each props.tracks as track, index (index)}
        <animate
            href={track.href}
            attributeName={track.attributeName}
            values={track.values}
            {...animate.getAttributes()}
        />
    {/each}
{/key}
