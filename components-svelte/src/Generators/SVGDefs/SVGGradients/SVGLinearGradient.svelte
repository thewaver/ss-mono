<svelte:options namespace="svg" />

<script lang="ts">
    import { SVGGradientDefsUtils } from "@thewaver/ss-components";
    import { SVGUtils } from "@thewaver/ss-utils";

    import Markup from "../../../Utils/Markup.svelte";
    import type { SVGLinearGradientProps } from "./SVGGradientDefsSvelte.types.js";

    let props: SVGLinearGradientProps = $props();

    const baseProps = $derived.by(() => {
        const { id, angle, offset, scale, colors, spreadKind, ...rest } = props.defs;

        return rest;
    });

    const coords = $derived(
        SVGUtils.getLinearCoords({ angle: props.defs.angle, offset: props.defs.offset, scale: props.defs.scale }),
    );

    const custom = $derived(
        typeof props.custom === "function" ? props.custom(coords.x1, coords.y1, coords.x2, coords.y2) : props.custom,
    );

    const stops = $derived(SVGGradientDefsUtils.computeStops(props.defs.id, props.defs.colors, props.defs.spreadKind));
</script>

<linearGradient {...baseProps} id={props.defs.id} x1={coords.x1} y1={coords.y1} x2={coords.x2} y2={coords.y2}>
    <Markup markup={custom} />

    {#each stops as stop (stop.id)}
        <stop id={stop.id} offset={stop.offset} stop-color={stop.color} />
    {/each}
</linearGradient>
