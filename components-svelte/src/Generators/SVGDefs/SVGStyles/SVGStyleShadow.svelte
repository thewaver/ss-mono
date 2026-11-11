<svelte:options namespace="svg" />

<script lang="ts">
    import type { SVGStyleShadowProps } from "./SVGStyleDefsSvelte.types.js";

    const SHADOW_SOURCE_COLOR = "black";

    let props: SVGStyleShadowProps = $props();
</script>

<filter
    id={props.shadow.id}
    x={props.shadow.region.x}
    y={props.shadow.region.y}
    width={props.shadow.region.width}
    height={props.shadow.region.height}
    color-interpolation-filters="sRGB"
>
    {#if props.shadow.isInset}
        <feFlood flood-color={SHADOW_SOURCE_COLOR} />
        <feComposite in2="SourceAlpha" operator="out" />
        <feOffset dx={props.shadow.dx} dy={props.shadow.dy} />
        <feGaussianBlur stdDeviation={props.shadow.stdDeviation} result="cast" />
    {:else}
        <feGaussianBlur in="SourceAlpha" stdDeviation={props.shadow.stdDeviation} />
        <feOffset dx={props.shadow.dx} dy={props.shadow.dy} result="cast" />
    {/if}
    <feFlood flood-color={props.shadow.color} />
    <feComposite in2="cast" operator="in" result="shade" />
    {#if !props.shadow.isClipped}
        <feComposite in="shade" in2="SourceAlpha" operator={props.shadow.isInset ? "in" : "out"} />
    {/if}
</filter>
