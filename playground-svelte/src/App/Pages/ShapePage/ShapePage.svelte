<script lang="ts">
    import type { SVGDefsColors } from "@thewaver/ss-components-svelte";
    import { SVGDefsSamples, toStyle } from "@thewaver/ss-components-svelte";
    import * as styles from "@thewaver/ss-playground/App/Pages/ShapePage/ShapePage.css";
    import { assignInlineVars } from "@vanilla-extract/dynamic";

    import { ShapeKnobs } from "../../Knobs/Shapes.const";
    import type { ExampleDefs } from "../../PageComponents/Examples/Examples.types";
    import PageExamples from "../../PageComponents/Examples/PageExamples.svelte";
    import PageColorField from "../../PageComponents/Field/PageColorField.svelte";
    import PageNumberField from "../../PageComponents/Field/PageNumberField.svelte";
    import PageSelectField from "../../PageComponents/Field/PageSelectField.svelte";
    import PagePaintPicker from "../../PageComponents/PaintPicker/PagePaintPicker.svelte";
    import { getIsUsingKind } from "../../PageComponents/PaintPicker/PaintPicker.const";
    import { createPaintSlot } from "../../PageComponents/PaintPicker/PaintPicker.utils.svelte";
    import PageProp from "../../PageComponents/Prop/Prop.svelte";
    import PagePropsDivider from "../../PageComponents/PropsPanel/PagePropsDivider.svelte";
    import PagePropsGroups from "../../PageComponents/PropsPanel/PagePropsGroups.svelte";
    import PagePropsPanel from "../../PageComponents/PropsPanel/PagePropsPanel.svelte";
    import DefaultExampleWrapper from "./DefaultExampleWrapper.svelte";
    import MorphExampleWrapper from "./MorphExampleWrapper.svelte";
    import SharedPaintExampleWrapper from "./SharedPaintExampleWrapper.svelte";
    import type { ShapeExampleProps } from "./ShapePage.types";
    import StressTestWrapper from "./StressTestWrapper.svelte";
    import TextWrapExampleWrapper from "./TextWrapExampleWrapper.svelte";

    const EXAMPLES_ROOT = "/src/App/Pages/ShapePage/Examples";
    const DEFAULT_EXAMPLE_PATH = `${EXAMPLES_ROOT}/Default.svelte`;

    let blurWidth = $state(ShapeKnobs.STARTING_BLUR_WIDTH);
    let animationDurationMs = $state(ShapeKnobs.STARTING_DURATION_MS);
    let edgeThickness = $state(ShapeKnobs.STARTING_EDGE_THICKNESS);
    const stroke = createPaintSlot(ShapeKnobs.STARTING_STROKE_PAINT_KIND);
    const fill = createPaintSlot(ShapeKnobs.STARTING_FILL_PAINT_KIND);

    let iterationConfigKey = $state<SVGDefsSamples.Iteration.SampleKey>(ShapeKnobs.STARTING_ITERATION_KEY);
    let cellSize = $state(ShapeKnobs.STARTING_CELL_SIZE);
    let colors = $state.raw<SVGDefsColors>({ ...SVGDefsSamples.SAMPLE_COLORS });

    const colorKeys = $derived(Object.keys(colors) as (keyof SVGDefsColors)[]);

    const usesPattern = $derived(getIsUsingKind([stroke.paint, fill.paint], ["pattern", "trackedPattern"]));
    const usesTiming = $derived(getIsUsingKind([stroke.paint, fill.paint], ["pattern", "timed"]));

    const commonProps: ShapeExampleProps = $derived({
        shouldClipChildren: ShapeKnobs.STARTING_SHOULD_CLIP_CHILDREN,
        shouldPadChildren: ShapeKnobs.STARTING_SHOULD_PAD_CHILDREN,
        blurWidth,
        animationDurationMs,
        colors,
        shapeKind: ShapeKnobs.STARTING_SHAPE_KIND,
        strokePaint: stroke.paint,
        fillPaint: fill.paint,
        iterationConfigKey,
        cellSize: { width: cellSize, height: cellSize },
        edgeThicknesses: [edgeThickness],
        joinRadii: ShapeKnobs.STARTING_JOIN_RADII,
        lameExponents: ShapeKnobs.STARTING_LAME_EXPONENTS,
    });

    const examples: ExampleDefs[] = [
        {
            key: "default",
            name: "Default",
            component: defaultExample,
            path: DEFAULT_EXAMPLE_PATH,
        },
        {
            key: "morph",
            name: "Morph",
            readout: () =>
                "one number from 0 to 1 is read inside computePoints and blends two contours of twice the star-point count each, their corner radii and their exponents with them; under reduced motion the press jumps straight to the other shape",
            component: morphExample,
            path: `${EXAMPLES_ROOT}/Morph.svelte`,
        },
        {
            key: "sharedPaint",
            name: "Shared Paint",
            readout: () =>
                "four shapes painted by one fill and one stroke laid across the whole group, so each shows its own part of a single picture; resize any of them and the picture stretches to the new group",
            component: sharedPaintExample,
            path: `${EXAMPLES_ROOT}/SharedPaint.svelte`,
        },
        {
            key: "textWrap",
            name: "Text Wrap",
            readout: () =>
                "the shape writes its contour as shape-outside, so floating it is all the page does for the text to follow the edge",
            component: textWrapExample,
            path: `${EXAMPLES_ROOT}/TextWrap.svelte`,
        },
        {
            key: "stressTest",
            name: "Stress Test",
            component: stressTestExample,
        },
    ];
</script>

{#snippet defaultExample()}
    <DefaultExampleWrapper {...commonProps} />
{/snippet}

{#snippet morphExample()}
    <MorphExampleWrapper {...commonProps} />
{/snippet}

{#snippet sharedPaintExample()}
    <SharedPaintExampleWrapper {...commonProps} />
{/snippet}

{#snippet textWrapExample()}
    <TextWrapExampleWrapper {...commonProps} />
{/snippet}

{#snippet stressTestExample()}
    <StressTestWrapper {...commonProps} />
{/snippet}

<div class={styles.root} style={toStyle(assignInlineVars({ [styles.backgroundColor]: colors.background }))}>
    <PagePropsGroups>
        <PagePaintPicker
            paintSlot={stroke}
            name={"stroke"}
            label={"Stroke"}
            hint={"What paints the shape's stroke: a flat color, a pattern, or a gradient that runs on a clock or follows the pointer."}
        />

        <PagePropsDivider />

        <PagePaintPicker
            paintSlot={fill}
            name={"fill"}
            label={"Fill"}
            hint={"What paints the shape's inside: a flat color, a pattern, or a gradient that runs on a clock or follows the pointer."}
        />

        <PagePropsDivider />

        <PagePropsPanel scope={"global"}>
            {#if usesPattern}
                <PageProp
                    itemKey={"cellSize"}
                    label={"Pattern Cell Size (px)"}
                    hint={"How large one tile of a pattern is before it repeats."}
                >
                    <PageNumberField
                        value={cellSize}
                        min={ShapeKnobs.MIN_CELL_SIZE}
                        max={ShapeKnobs.MAX_CELL_SIZE}
                        step={ShapeKnobs.CELL_SIZE_STEP}
                        ariaLabel={"Pattern cell size"}
                        onInput={(value) => {
                            cellSize = value;
                        }}
                    />
                </PageProp>
            {/if}

            <PageProp
                itemKey={"colors"}
                label={"Colors"}
                hint={"The colors the stroke, the fill and the page's own background are painted from."}
            >
                <div class={styles.colorList}>
                    {#each colorKeys as key (key)}
                        <PageColorField
                            value={colors[key]}
                            ariaLabel={key}
                            onInput={(value) => {
                                colors = { ...colors, [key]: value };
                            }}
                        />
                    {/each}
                </div>
            </PageProp>

            <PageProp itemKey={"strokeThicknessPx"} label={"Stroke Thickness (px)"} hint={"How thick the stroke is."}>
                <PageNumberField
                    value={edgeThickness}
                    min={ShapeKnobs.MIN_EDGE_THICKNESS}
                    max={ShapeKnobs.MAX_EDGE_THICKNESS}
                    step={ShapeKnobs.EDGE_THICKNESS_STEP}
                    ariaLabel={"Stroke thickness"}
                    onInput={(value) => {
                        edgeThickness = value;
                    }}
                />
            </PageProp>

            <PageProp
                itemKey={"blurWidth"}
                label={"Blur (px)"}
                hint={"How far the stroke is blurred outward, which is what gives it its glow."}
            >
                <PageNumberField
                    value={blurWidth}
                    min={ShapeKnobs.MIN_BLUR_WIDTH}
                    max={ShapeKnobs.MAX_BLUR_WIDTH}
                    step={ShapeKnobs.BLUR_WIDTH_STEP}
                    ariaLabel={"Blur width"}
                    onInput={(value) => {
                        blurWidth = value;
                    }}
                />
            </PageProp>

            {#if usesTiming}
            <PageProp
                itemKey={"animationDurationMs"}
                label={"Animation duration (ms)"}
                hint={"How long one pass of the stroke or fill animation takes."}
            >
                <PageNumberField
                    value={animationDurationMs}
                    min={ShapeKnobs.MIN_DURATION_MS}
                    max={ShapeKnobs.MAX_DURATION_MS}
                    step={ShapeKnobs.DURATION_STEP_MS}
                    ariaLabel={"Animation duration"}
                    onInput={(value) => {
                        animationDurationMs = value;
                    }}
                />
            </PageProp>

            <PageProp
                itemKey={"iterationConfigKey"}
                label={"Iteration Pattern"}
                hint={"How the animation repeats: once, endlessly, or back and forth."}
            >
                <PageSelectField
                    value={iterationConfigKey}
                    values={SVGDefsSamples.Iteration.SAMPLE_KEYS}
                    ariaLabel={"Iteration pattern"}
                    onChange={(value) => {
                        iterationConfigKey = value;
                    }}
                />
            </PageProp>
            {/if}
        </PagePropsPanel>
    </PagePropsGroups>

    <PageExamples items={examples} layout={"flow"} />
</div>
