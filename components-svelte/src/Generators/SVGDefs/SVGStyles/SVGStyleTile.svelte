<svelte:options namespace="svg" />

<script lang="ts">
    import Markup from "../../../Utils/Markup.svelte";
    import { SVGGradientDefsSvelteUtils } from "../SVGGradients/SVGGradientDefsSvelte.utils.js";
    import type { SVGStyleTileProps } from "./SVGStyleDefsSvelte.types.js";

    let props: SVGStyleTileProps = $props();

    const gradientMarkup = $derived(
        props.gradient.kind === "linear_gradient"
            ? SVGGradientDefsSvelteUtils.computeLinearGradient(props.gradient.gradient)
            : SVGGradientDefsSvelteUtils.computeRadialGradient(props.gradient.gradient),
    );

    const source = $derived(props.tile.source);
</script>

<Markup markup={gradientMarkup} />

<pattern
    id={props.tile.id}
    patternUnits="userSpaceOnUse"
    x={props.tile.x}
    y={props.tile.y}
    width={props.tile.width}
    height={props.tile.height}
>
    <svg
        width={props.tile.tileWidth}
        height={props.tile.tileHeight}
        viewBox={`${source.x} ${source.y} ${source.width} ${source.height}`}
        preserveAspectRatio="none"
    >
        <rect
            width={props.tile.imageWidth}
            height={props.tile.imageHeight}
            fill={`url(#${props.gradient.gradient.id})`}
        />
    </svg>
</pattern>
