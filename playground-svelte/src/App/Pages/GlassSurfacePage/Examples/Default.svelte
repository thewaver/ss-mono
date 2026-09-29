<script lang="ts">
    import { GlassSurface, InteractionTrackerSvelteUtils, SVGDefsSamples, toStyle } from "@thewaver/ss-components-svelte";
    import {
        NO_SAMPLE_KEY,
        computeNoSampleDefs,
    } from "@thewaver/ss-playground/App/PageComponents/SampleGroups/SampleGroups.const";
    import * as styles from "@thewaver/ss-playground/App/Pages/GlassSurfacePage/GlassSurfacePage.css";
    import knight from "@thewaver/ss-playground/App/knight.webp";
    import { CSSUtils, type Point2d } from "@thewaver/ss-utils";
    import { assignInlineVars } from "@vanilla-extract/dynamic";

    import type { GlassSurfaceExampleProps } from "../GlassSurfacePage.types";

    const STARTING_RATIO: Point2d = { x: 0.5, y: 0.5 };
    const HALF_PANE = styles.paneSize * 0.5;

    const toOffset = (ratio: number) =>
        `clamp(0px, calc(${ratio * 100}% - ${HALF_PANE}px), calc(100% - ${styles.paneSize}px))`;

    let {
        borderRadius,
        borderWidth,
        strokeConfigKey,
        strokeConfigDefs,
        colors,
        blurWidth,
        blurRadius,
        noiseFrequency,
        noiseOctaves,
        rippleScale,
        tintColor,
        tintOpacity,
        lightHeight,
        surfaceScale,
        specularConstant,
        specularExponent,
    }: GlassSurfaceExampleProps = $props();

    const id = $props.id();

    let stage = $state<HTMLDivElement>();
    let grabOffset: Point2d | undefined;
    let ratio = $state.raw(STARTING_RATIO);

    const { getIsDragging } = InteractionTrackerSvelteUtils.trackDrag(
        () => stage,
        () => false,
        {
            onDrag: (dragRatio) => {
                grabOffset ??= { x: dragRatio.x - ratio.x, y: dragRatio.y - ratio.y };

                ratio = { x: dragRatio.x - grabOffset.x, y: dragRatio.y - grabOffset.y };
            },
            onDragEnd: () => {
                grabOffset = undefined;
            },
        },
    );
</script>

<div bind:this={stage} class={styles.stage} style:background-image={`url(${knight})`}>
    <div
        class={styles.paneHost}
        data-dragging={getIsDragging() ? "" : undefined}
        style={toStyle(
            assignInlineVars({
                [styles.paneLeftVar]: toOffset(ratio.x),
                [styles.paneTopVar]: toOffset(ratio.y),
            }),
        )}
    >
        <GlassSurface
            borderRadii={CSSUtils.spreadRadius(borderRadius)}
            borderWidths={CSSUtils.spreadWidth(borderWidth)}
            computeStrokeDefs={(size, element) => {
                if (strokeConfigKey === NO_SAMPLE_KEY) return computeNoSampleDefs(colors, "stroke");

                return SVGDefsSamples.Gradient.Tracked.toConfig({
                    family: strokeConfigKey,
                    defs: strokeConfigDefs,
                } as SVGDefsSamples.Gradient.Tracked.Entry).computeSVGDefs(`stroke-${id}`, undefined, element, {
                    getSize: () => size,
                    colors,
                    blurWidth,
                });
            }}
            glassDefs={{
                noise: {
                    frequency: noiseFrequency,
                    octaves: noiseOctaves,
                },
                backdrop: { blurRadius },
                ripple: { scale: rippleScale },
                tint: { color: tintColor, opacity: tintOpacity },
                sheen: {
                    lightHeight,
                    surfaceScale,
                    specularConstant,
                    specularExponent,
                },
            }}
        >
            <div class={styles.paneContent}>Glass</div>
        </GlassSurface>

        <div class={styles.paneShadow} style:border-radius={`${borderRadius}px`}></div>
    </div>
</div>
