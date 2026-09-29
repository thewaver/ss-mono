<script lang="ts">
    import {
        InteractionTrackerSvelteUtils,
        SVGDefsSamples,
        Shape,
        type StyleRecord,
        toStyle,
    } from "@thewaver/ss-components-svelte";
    import {
        NO_SAMPLE_KEY,
        computeNoSampleDefs,
    } from "@thewaver/ss-playground/App/PageComponents/SampleGroups/SampleGroups.const";
    import * as styles from "@thewaver/ss-playground/App/Pages/ShapePage/ShapePage.css";
    import { ShapeConst, ShapeUtils, type Size2d } from "@thewaver/ss-utils";

    import type { ShapeExampleProps } from "../ShapePage.types";

    type Props = ShapeExampleProps;

    let props: Props = $props();

    const id = $props.id();

    let root = $state<HTMLDivElement>();

    const { getFlags } = InteractionTrackerSvelteUtils.wrapElement(
        () => root ?? undefined,
        () => false,
        { applyButtonSemantics: true },
    );

    const iterationConfig = $derived(SVGDefsSamples.Iteration.SAMPLE_CONFIGS[props.iterationConfigKey]);

    const strokeGeom = $derived.by(() => {
        const geom = [{ thicknesses: props.edgeThicknesses }];

        if (getFlags().isFocusVisible) {
            geom.push({ thicknesses: [2] });
        }

        return geom;
    });

    const computeStrokeDefs = (size: Size2d, element: HTMLElement | undefined) => {
        const flags = getFlags();

        const strokes =
            props.strokeConfigKey === NO_SAMPLE_KEY
                ? computeNoSampleDefs(props.colors, "stroke")
                : SVGDefsSamples.Gradient.Timed.toConfig({
                      family: props.strokeConfigKey,
                      defs: props.strokeConfigDefs,
                  } as SVGDefsSamples.Gradient.Timed.Entry).computeSVGDefs(`stroke-${id}`, flags, element, {
                      getSize: () => size,
                      animationDurationMs: props.animationDurationMs,
                      colors: props.colors,
                      blurWidth: props.blurWidth,
                      ...iterationConfig.computeDefs(props.animationDurationMs),
                  });

        if (flags.isFocusVisible) {
            strokes.push({ color: "#FF00FF" });
        }

        return strokes;
    };

    const computeFillDefs = (size: Size2d, element: HTMLElement | undefined) =>
        props.fillConfigKey === NO_SAMPLE_KEY
            ? computeNoSampleDefs(props.colors, "fill")
            : SVGDefsSamples.Pattern.SAMPLE_CONFIGS[props.fillConfigKey].computeSVGDefs(
                  `fill-${id}`,
                  undefined,
                  element,
                  {
                      getSize: () => size,
                      cellSize: props.cellSize,
                      animationDurationMs: props.animationDurationMs,
                      colors: props.colors,
                      blurWidth: props.blurWidth,
                      ...iterationConfig.computeDefs(props.animationDurationMs),
                  },
              );
</script>

<div class={styles.exampleHost}>
    <Shape
        joinRadii={props.joinRadii}
        lameExponents={props.lameExponents}
        computePoints={(size) => ShapeConst.getDefaultShapePoints(props.shapeKind, size)}
        {computeStrokeDefs}
        {strokeGeom}
        {computeFillDefs}
    >
        {#snippet renderChildren(size, clipPath, clipPoints)}
            {@const clipStyle = props.shouldClipChildren ? { clipPath: `path("${clipPath}")` } : {}}
            {@const paddingStyle = !props.shouldPadChildren
                ? {}
                : props.shapeKind === "square"
                  ? ShapeUtils.getRectPadding(props.edgeThicknesses, props.joinRadii, props.lameExponents)
                  : ShapeUtils.getPolygonPadding(size, clipPoints)}
            <div bind:this={root} class={styles.example} style={toStyle(clipStyle, paddingStyle as StyleRecord)}>
                <div class={styles.exampleInner}>I have a border</div>
            </div>
        {/snippet}
    </Shape>
</div>
