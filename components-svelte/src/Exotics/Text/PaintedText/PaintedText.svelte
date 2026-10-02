<script lang="ts">
    import { tick, untrack } from "svelte";

    import {
        PAINTED_TEXT_DEFAULTS,
        PaintedTextUtils,
        ShapeLayerUtils,
        PaintedTextStyles as styles,
    } from "@thewaver/ss-components";

    import Markup from "../../../Utils/Markup.svelte";
    import { readStore } from "../../../Utils/storeUtils.js";
    import { toStyle } from "../../../Utils/styleUtils.js";
    import type { PaintedTextController, PaintedTextProps } from "./PaintedText.types.js";

    const MASK_PADDING_SIDES = 2;

    let props: PaintedTextProps = $props();

    const uid = $props.id();
    const maskId = `painted-text-mask-${uid}`;

    let root = $state<HTMLDivElement>();
    let source = $state<HTMLDivElement>();
    let layoutHost = $state<HTMLDivElement>();

    const layout = PaintedTextUtils.createLayout({
        getSource: () => source ?? undefined,
        getLayoutHost: () => layoutHost ?? undefined,
    });

    const getLayoutState = readStore(layout);

    const controller: PaintedTextController = {
        update: () => {
            if (!source) return false;

            void tick().then(() => layout.update());

            return true;
        },
    };

    $effect(() => {
        const element = source;

        return untrack(() => {
            props.onMount?.(controller);

            return element ? layout.observe(element) : undefined;
        });
    });

    const width = $derived(getLayoutState().width ?? 0);
    const height = $derived(getLayoutState().height);
    const size = $derived({ width, height });
    const strokePaint = $derived(
        PaintedTextUtils.computeStrokePaint(
            props.strokeAlignment ?? PAINTED_TEXT_DEFAULTS.strokeAlignment,
            props.strokeWidth ?? PAINTED_TEXT_DEFAULTS.strokeWidth,
        ),
    );
    const strokeDefs = $derived(props.computeStrokeDefs?.(size, root ?? undefined) ?? []);
    const fillDefs = $derived(
        PaintedTextUtils.resolveFillDefs(props.computeFillDefs?.(size, root ?? undefined), strokeDefs),
    );
    const maskPadding = $derived(strokePaint.drawnWidth);

    const attachAtomic = (element: SVGElement) => (node: SVGGElement) => {
        if (node.firstChild !== element) node.replaceChildren(element);
    };
</script>

{#snippet runs(isReadable: boolean)}
    {#each getLayoutState().runs as run, index (index)}
        <tspan x={run.x} y={run.y} style={toStyle(run.style)}
            >{#if isReadable && run.title}<title>{run.title}</title>{/if}{#if isReadable && run.anchor}<a
                    href={run.anchor.href}
                    target={run.anchor.target}
                    rel={run.anchor.rel}>{run.text}</a
                >{:else}{run.text}{/if}</tspan
        >
    {/each}
{/snippet}

<div bind:this={root} class={styles.paintedTextRoot}>
    <div bind:this={source} class={styles.paintedTextSourceWrap} aria-hidden="true" inert>
        {@render props.children?.()}
    </div>

    <div bind:this={layoutHost} class={styles.paintedTextLayoutWrap} aria-hidden="true" inert></div>

    <svg class={styles.paintedTextSVG} {width} {height} viewBox={`0 0 ${width} ${height}`}>
        <defs>
            {#each [...fillDefs, ...strokeDefs] as def, index (index)}
                <Markup markup={def.gradientOrPattern?.renderDefsElement()} />
                <Markup markup={def.filter?.renderDefsElement()} />
                <Markup markup={def.clipPath?.renderDefsElement()} />
            {/each}

            {#if strokePaint.maskKind}
                <mask
                    id={maskId}
                    maskUnits="userSpaceOnUse"
                    x={-maskPadding}
                    y={-maskPadding}
                    width={width + maskPadding * MASK_PADDING_SIDES}
                    height={height + maskPadding * MASK_PADDING_SIDES}
                >
                    {#if strokePaint.maskKind === "outside"}
                        <rect
                            x={-maskPadding}
                            y={-maskPadding}
                            width={width + maskPadding * MASK_PADDING_SIDES}
                            height={height + maskPadding * MASK_PADDING_SIDES}
                            fill="white"
                        />
                    {/if}

                    <text class={styles.paintedTextLayer} fill={strokePaint.maskKind === "outside" ? "black" : "white"}>
                        {@render runs(false)}
                    </text>
                </mask>
            {/if}
        </defs>

        {#each fillDefs as def, index (index)}
            {@const paint = ShapeLayerUtils.computePaint(def)}
            {@const isReadable = PaintedTextUtils.getIsReadableLayer("fill", index, fillDefs.length)}
            <text
                class={styles.paintedTextLayer}
                fill={paint.fill}
                fill-opacity={paint.fillOpacity}
                filter={paint.filter}
                clip-path={paint.clipPath}
                style:mix-blend-mode={paint.mixBlendMode}
                aria-hidden={isReadable ? undefined : "true"}
            >
                {@render runs(isReadable)}
            </text>
        {/each}

        {#each strokeDefs as def, index (index)}
            {@const paint = ShapeLayerUtils.computePaint(def)}
            {@const isReadable = PaintedTextUtils.getIsReadableLayer("stroke", index, fillDefs.length)}
            <text
                class={styles.paintedTextLayer}
                fill="none"
                stroke={paint.fill}
                stroke-opacity={paint.fillOpacity}
                stroke-width={strokePaint.drawnWidth}
                stroke-linejoin="round"
                mask={strokePaint.maskKind ? `url(#${maskId})` : undefined}
                filter={paint.filter}
                clip-path={paint.clipPath}
                style:mix-blend-mode={paint.mixBlendMode}
                aria-hidden={isReadable ? undefined : "true"}
            >
                {@render runs(isReadable)}
            </text>
        {/each}

        {#each getLayoutState().atomics as node, index (index)}
            <g {@attach attachAtomic(node)}></g>
        {/each}
    </svg>
</div>
