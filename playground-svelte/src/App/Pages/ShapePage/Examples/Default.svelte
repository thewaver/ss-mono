<script lang="ts">
    import { InteractionTrackerSvelteUtils, Shape, type StyleRecord, toStyle } from "@thewaver/ss-components-svelte";
    import * as styles from "@thewaver/ss-playground/App/Pages/ShapePage/ShapePage.css";
    import { ShapeConst, ShapeUtils, type Size2d } from "@thewaver/ss-utils";

    import { computeShapeFillDefs, computeShapeStrokeDefs } from "../ShapePage.const";
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

    const strokeGeom = $derived.by(() => {
        const geom = [{ thicknesses: props.edgeThicknesses }];

        if (getFlags().isFocusVisible) {
            geom.push({ thicknesses: [2] });
        }

        return geom;
    });

    const computeStrokeDefs = (size: Size2d, element: HTMLElement | undefined) => {
        const flags = getFlags();
        const strokes = computeShapeStrokeDefs(id, props, size, element, flags);

        if (flags.isFocusVisible) {
            strokes.push({ color: "#FF00FF" });
        }

        return strokes;
    };

    const computeFillDefs = (size: Size2d, element: HTMLElement | undefined) =>
        computeShapeFillDefs(id, props, size, element);
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
