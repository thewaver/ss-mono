<script lang="ts">
    import type { Snippet } from "svelte";

    import { ElementObserverUtils } from "@thewaver/ss-components";
    import { SVGStyleDefsSvelteUtils, Shape } from "@thewaver/ss-components-svelte";
    import * as styles from "@thewaver/ss-playground/App/StyledComponents/TooltipContent/TooltipContent.css";
    import {
        computeTooltipBackdropBox,
        fitFillGeomToArrow,
        toTooltipBodyStyle,
    } from "@thewaver/ss-playground/App/StyledComponents/TooltipContent/TooltipContent.utils";
    import type { Size2d } from "@thewaver/ss-utils";

    import { getNextLayerClass } from "../Layer/Layer.context";
    import type { TooltipSurfaceProps } from "./TooltipContent.types";

    let props: TooltipSurfaceProps & { children?: Snippet } = $props();

    const id = $props.id();
    const getLayerClassName = getNextLayerClass();

    let probe = $state<HTMLDivElement>();
    let probeSize = $state.raw<Size2d>({ width: 0, height: 0 });
    let contourPath = $state("");

    $effect(() => {
        const element = probe;

        if (!element) return;

        return ElementObserverUtils.observeBorderBoxSize(element, (size) => {
            probeSize = size;
        });
    });

    const skin = $derived.by(() => {
        const size = probeSize;

        if (!probe || size.width <= 0 || size.height <= 0) return undefined;

        const style = getComputedStyle(probe);

        return { converted: SVGStyleDefsSvelteUtils.computeDefsFromStyle(style, size, id), textColor: style.color };
    });

    const converted = $derived(skin?.converted);

    const strokeDefs = $derived(converted?.strokeDefs ?? []);

    const backdropBox = $derived(computeTooltipBackdropBox(contourPath));
</script>

{#snippet renderBody()}
    <div class={styles.tooltipText} style:color={skin?.textColor}>
        {@render props.children?.()}
    </div>
{/snippet}

<div class={[styles.tooltipFrame, getLayerClassName()]}>
    <div bind:this={probe} class={styles.tooltipSkinProbe} aria-hidden="true"></div>

    {#if converted?.backdropFilter && backdropBox}
        <div
            class={[styles.tooltipBackdrop, styles.tooltipFadePart]}
            aria-hidden="true"
            style:backdrop-filter={converted.backdropFilter}
            style:clip-path={`path("${backdropBox.path}")`}
            style:left={`${backdropBox.left}px`}
            style:top={`${backdropBox.top}px`}
            style:width={`${backdropBox.width}px`}
            style:height={`${backdropBox.height}px`}
        ></div>
    {/if}

    <div class={styles.tooltipFadePart}>
        <Shape
            computePoints={(size) => props.computeGeometry(size, toTooltipBodyStyle(converted))}
            fillGeom={fitFillGeomToArrow(converted?.fillGeom ?? [], props.hasArrow ?? false)}
            onContourChange={(contour) => {
                contourPath = contour.path;
            }}
            computeFillDefs={() => converted?.fillDefs ?? []}
            computeStrokeDefs={strokeDefs.length > 0 ? () => strokeDefs : undefined}
            renderChildren={renderBody}
        />
    </div>
</div>
