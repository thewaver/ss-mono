<script lang="ts">
    import {
        Button,
        SVGDefsSamples,
        Shape,
        TrackedGradientDefaults,
        attachPortal,
    } from "@thewaver/ss-components-svelte";
    import { NO_SAMPLE_KEY } from "@thewaver/ss-playground/App/PageComponents/SampleGroups/SampleGroups.const";
    import * as styles from "@thewaver/ss-playground/App/Pages/SVGGradients/SVGGradients.css";
    import { ShapeConst, type Size2d } from "@thewaver/ss-utils";

    import { TrackedGradientKnobs } from "../../../../Knobs/TrackedGradients.const";
    import PageButtonContent from "../../../../StyledComponents/ButtonContent/ButtonContent.svelte";
    import type { TrackedGradientExampleProps } from "../../SVGGradients.types";

    let props: TrackedGradientExampleProps = $props();

    const id = $props.id();

    let isShown = $state(false);

    const computeDefs = (size: Size2d, element: HTMLElement | undefined) => {
        const key = props.configKey;

        if (key === NO_SAMPLE_KEY) return [];

        const defaults = TrackedGradientDefaults.DEFAULTS_BY_FAMILY[key] as Record<string, unknown>;
        const values = props.configDefs;
        const scaledValues = Object.fromEntries(
            TrackedGradientKnobs.OVERLAY_SCALED_KEYS.filter((name) => name in defaults).map((name) => [
                name,
                ((values[name] ?? defaults[name]) as number) * TrackedGradientKnobs.OVERLAY_SCALE_FACTOR,
            ]),
        );

        return SVGDefsSamples.Gradient.Tracked.toConfig({
            family: key,
            defs: { ...values, ...scaledValues },
        } as SVGDefsSamples.Gradient.Tracked.Entry)
            .computeSVGDefs(`overlay-${id}`, undefined, element, {
                getSize: () => size,
                colors: props.colors,
                blurWidth: props.blurWidth,
            })
            .filter((def) => def.gradientOrPattern);
    };
</script>

<Button
    onClick={() => {
        isShown = true;
    }}
>
    {#snippet renderContent(flags)}
        <PageButtonContent {flags}>Track the pointer across the screen</PageButtonContent>
    {/snippet}
</Button>

{#if isShown}
    <div {@attach attachPortal(document.body)}>
        <div class={styles.screenOverlay}>
            <Shape
                computePoints={(size) => ShapeConst.getDefaultShapePoints("square", size)}
                computeFillDefs={computeDefs}
            >
                {#snippet renderChildren()}
                    <div class={styles.screenOverlayBox}></div>
                {/snippet}
            </Shape>
        </div>

        <div class={styles.screenOverlayClose}>
            <Button
                onClick={() => {
                    isShown = false;
                }}
            >
                {#snippet renderContent(flags)}
                    <PageButtonContent {flags}>Close pointer-tracking overlay</PageButtonContent>
                {/snippet}
            </Button>
        </div>
    </div>
{/if}
