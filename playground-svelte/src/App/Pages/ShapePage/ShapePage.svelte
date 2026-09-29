<script lang="ts">
    import type { SVGDefsColors } from "@thewaver/ss-components-svelte";
    import { SVGDefsSamples, TimedGradientDefaults, toStyle } from "@thewaver/ss-components-svelte";
    import {
        NO_SAMPLE_KEY,
        splitEntriesIntoGroups,
        toGroupEntriesWithNoSample,
    } from "@thewaver/ss-playground/App/PageComponents/SampleGroups/SampleGroups.const";
    import type { WithNoSample } from "@thewaver/ss-playground/App/PageComponents/SampleGroups/SampleGroups.types";
    import * as styles from "@thewaver/ss-playground/App/Pages/ShapePage/ShapePage.css";
    import { assignInlineVars } from "@vanilla-extract/dynamic";

    import { ShapeKnobs } from "../../Knobs/Shapes.const";
    import { TimedGradientKnobs } from "../../Knobs/TimedGradients.const";
    import type { ExampleDefs } from "../../PageComponents/Examples/Examples.types";
    import PageExamples from "../../PageComponents/Examples/PageExamples.svelte";
    import PageColorField from "../../PageComponents/Field/PageColorField.svelte";
    import PageGroupedSelectField from "../../PageComponents/Field/PageGroupedSelectField.svelte";
    import PageNumberField from "../../PageComponents/Field/PageNumberField.svelte";
    import PageSelectField from "../../PageComponents/Field/PageSelectField.svelte";
    import PageKnobs from "../../PageComponents/Knobs/Knobs.svelte";
    import type { Knob } from "../../PageComponents/Knobs/Knobs.types";
    import PageProp from "../../PageComponents/Prop/Prop.svelte";
    import PagePropsDivider from "../../PageComponents/PropsPanel/PagePropsDivider.svelte";
    import PagePropsGroups from "../../PageComponents/PropsPanel/PagePropsGroups.svelte";
    import PagePropsPanel from "../../PageComponents/PropsPanel/PagePropsPanel.svelte";
    import DefaultExampleWrapper from "./DefaultExampleWrapper.svelte";
    import MorphExampleWrapper from "./MorphExampleWrapper.svelte";
    import type { ShapeExampleProps } from "./ShapePage.types";
    import StressTestWrapper from "./StressTestWrapper.svelte";
    import TextWrapExampleWrapper from "./TextWrapExampleWrapper.svelte";

    const GROUPPED_GRADIENTS = splitEntriesIntoGroups(SVGDefsSamples.Gradient.Timed.SAMPLE_ENTRIES);
    const GROUPPED_PATTERNS = splitEntriesIntoGroups(SVGDefsSamples.Pattern.SAMPLE_CONFIGS);

    const STROKE_GROUPS = toGroupEntriesWithNoSample(GROUPPED_GRADIENTS);
    const FILL_GROUPS = toGroupEntriesWithNoSample(GROUPPED_PATTERNS);

    const EXAMPLES_ROOT = "/src/App/Pages/ShapePage/Examples";
    const DEFAULT_EXAMPLE_PATH = `${EXAMPLES_ROOT}/Default.svelte`;

    let blurWidth = $state(ShapeKnobs.STARTING_BLUR_WIDTH);
    let animationDurationMs = $state(ShapeKnobs.STARTING_DURATION_MS);
    let edgeThickness = $state(ShapeKnobs.STARTING_EDGE_THICKNESS);
    let strokeConfigKey = $state<WithNoSample<SVGDefsSamples.Gradient.Timed.SampleKey>>(
        ShapeKnobs.STARTING_GRADIENT_KEY,
    );
    let strokeConfigDefsByKey = $state.raw<Record<string, Record<string, number | boolean>>>({});

    const strokeKnobs = $derived(
        strokeConfigKey === NO_SAMPLE_KEY
            ? {}
            : (TimedGradientKnobs.KNOBS_BY_FAMILY[strokeConfigKey] as Record<string, Knob>),
    );
    const strokeDefaults = $derived(
        strokeConfigKey === NO_SAMPLE_KEY
            ? {}
            : (TimedGradientDefaults.DEFAULTS_BY_FAMILY[strokeConfigKey] as Record<string, unknown>),
    );
    const strokeConfigDefs = $derived(strokeConfigDefsByKey[strokeConfigKey] ?? {});

    let fillConfigKey = $state<WithNoSample<SVGDefsSamples.Pattern.SampleKey>>(NO_SAMPLE_KEY);
    let iterationConfigKey = $state<SVGDefsSamples.Iteration.SampleKey>(ShapeKnobs.STARTING_ITERATION_KEY);
    let cellSize = $state(ShapeKnobs.STARTING_CELL_SIZE);
    let colors = $state.raw<SVGDefsColors>({ ...SVGDefsSamples.SAMPLE_COLORS });

    const colorKeys = $derived(Object.keys(colors) as (keyof SVGDefsColors)[]);

    const commonProps: ShapeExampleProps = $derived({
        shouldClipChildren: ShapeKnobs.STARTING_SHOULD_CLIP_CHILDREN,
        shouldPadChildren: ShapeKnobs.STARTING_SHOULD_PAD_CHILDREN,
        blurWidth,
        animationDurationMs,
        colors,
        shapeKind: ShapeKnobs.STARTING_SHAPE_KIND,
        strokeConfigKey,
        strokeConfigDefs,
        fillConfigKey,
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
                "one number from 0 to 1 is read inside computePoints and blends two outlines of twice the star-point count each, their corner radii and their exponents with them; under reduced motion the press jumps straight to the other shape",
            component: morphExample,
            path: `${EXAMPLES_ROOT}/Morph.svelte`,
        },
        {
            key: "textWrap",
            name: "Text Wrap",
            readout: () =>
                "the shape writes its outline as shape-outside, so floating it is all the page does for the text to follow the edge",
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

{#snippet textWrapExample()}
    <TextWrapExampleWrapper {...commonProps} />
{/snippet}

{#snippet stressTestExample()}
    <StressTestWrapper {...commonProps} />
{/snippet}

<div class={styles.root} style={toStyle(assignInlineVars({ [styles.backgroundColor]: colors.background }))}>
    <PagePropsGroups>
        <PagePropsPanel scope={"sample"}>
            <PageProp
                itemKey={"strokeConfigKey"}
                label={"Stroke Pattern"}
                hint={"Which animated gradient paints the shape's outline. Choosing one brings its own knobs with it."}
            >
                <PageGroupedSelectField
                    value={strokeConfigKey}
                    groups={STROKE_GROUPS}
                    ariaLabel={"Stroke pattern"}
                    onChange={(value) => {
                        strokeConfigKey = value;
                    }}
                />
            </PageProp>

            <PageKnobs
                knobs={strokeKnobs}
                defaults={strokeDefaults}
                values={strokeConfigDefs}
                onInput={(key, value) => {
                    strokeConfigDefsByKey = {
                        ...strokeConfigDefsByKey,
                        [strokeConfigKey]: { ...strokeConfigDefsByKey[strokeConfigKey], [key]: value },
                    };
                }}
            />
        </PagePropsPanel>

        <PagePropsDivider />

        <PagePropsPanel scope={"global"}>
            <PageProp
                itemKey={"fillConfigKey"}
                label={"Fill Pattern"}
                hint={"Which repeating pattern fills the shape's inside. Choosing one brings its own knobs with it."}
            >
                <PageGroupedSelectField
                    value={fillConfigKey}
                    groups={FILL_GROUPS}
                    ariaLabel={"Fill pattern"}
                    onChange={(value) => {
                        fillConfigKey = value;
                    }}
                />
            </PageProp>

            <PageProp
                itemKey={"cellSize"}
                label={"Fill Cell Size (px)"}
                hint={"How large one tile of the fill pattern is before it repeats."}
            >
                <PageNumberField
                    value={cellSize}
                    min={ShapeKnobs.MIN_CELL_SIZE}
                    max={ShapeKnobs.MAX_CELL_SIZE}
                    step={ShapeKnobs.CELL_SIZE_STEP}
                    ariaLabel={"Fill cell size"}
                    onInput={(value) => {
                        cellSize = value;
                    }}
                />
            </PageProp>
            <PageProp
                itemKey={"colors"}
                label={"Colors"}
                hint={"The colors the outline, the fill and the page's own background are painted from."}
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

            <PageProp itemKey={"edgeThicknessPx"} label={"Edge Thickness (px)"} hint={"How thick the outline is."}>
                <PageNumberField
                    value={edgeThickness}
                    min={ShapeKnobs.MIN_EDGE_THICKNESS}
                    max={ShapeKnobs.MAX_EDGE_THICKNESS}
                    step={ShapeKnobs.EDGE_THICKNESS_STEP}
                    ariaLabel={"Edge thickness"}
                    onInput={(value) => {
                        edgeThickness = value;
                    }}
                />
            </PageProp>

            <PageProp
                itemKey={"blurWidth"}
                label={"Blur (px)"}
                hint={"How far the outline is blurred outward, which is what gives it its glow."}
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
        </PagePropsPanel>
    </PagePropsGroups>

    <PageExamples items={examples} layout={"flow"} />
</div>
