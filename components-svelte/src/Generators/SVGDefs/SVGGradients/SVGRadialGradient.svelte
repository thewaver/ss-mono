<svelte:options namespace="svg" />

<script lang="ts">
    import { SVGGradientDefsUtils } from "@thewaver/ss-components";

    import Markup from "../../../Utils/Markup.svelte";
    import { getPaintAreaContext } from "./PaintArea.context.js";
    import type { SVGRadialGradientProps } from "./SVGGradientDefsSvelte.types.js";

    let props: SVGRadialGradientProps = $props();

    const paintArea = getPaintAreaContext();

    const baseProps = $derived.by(() => {
        const { id, colors, origin, scale, aspect, angle, elementSize, spreadKind, ...rest } = props.defs;

        return rest;
    });

    const geometry = $derived(
        SVGGradientDefsUtils.computeRadialGeometry({
            origin: props.defs.origin,
            scale: props.defs.scale,
            aspect: props.defs.aspect,
            angle: props.defs.angle,
            elementSize: props.defs.elementSize,
        }),
    );

    const custom = $derived(
        typeof props.custom === "function" ? props.custom(geometry.cx, geometry.cy, geometry.r) : props.custom,
    );

    const areaAttributes = $derived(
        SVGGradientDefsUtils.computePaintAreaAttributes(paintArea?.getPaintArea(), geometry.gradientTransform),
    );

    const stops = $derived(SVGGradientDefsUtils.computeStops(props.defs.id, props.defs.colors, props.defs.spreadKind));
</script>

<radialGradient
    {...baseProps}
    id={props.defs.id}
    cx={geometry.cx}
    cy={geometry.cy}
    r={geometry.r}
    gradientUnits={areaAttributes.gradientUnits}
    gradientTransform={areaAttributes.gradientTransform}
>
    <Markup markup={custom} />

    {#each stops as stop (stop.id)}
        <stop id={stop.id} offset={stop.offset} stop-color={stop.color} />
    {/each}
</radialGradient>
