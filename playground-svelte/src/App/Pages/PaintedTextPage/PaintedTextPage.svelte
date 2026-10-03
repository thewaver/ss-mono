<script lang="ts">
    import {
        PAINTED_TEXT_DEFAULTS,
        type PaintedTextStrokeAlignment,
        type SVGDefsColors,
        SVGDefsSamples,
    } from "@thewaver/ss-components-svelte";
    import * as styles from "@thewaver/ss-playground/App/Pages/PaintedTextPage/PaintedTextPage.css";

    import { PaintedTextKnobs } from "../../Knobs/PaintedTexts.const";
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
    import CustomInputExampleWrapper from "./CustomInputExampleWrapper.svelte";
    import HeadingExampleWrapper from "./HeadingExampleWrapper.svelte";
    import type { PaintedTextExampleWrapperProps } from "./PaintedTextPage.types";
    import ParagraphExampleWrapper from "./ParagraphExampleWrapper.svelte";
    import ScrambledExampleWrapper from "./ScrambledExampleWrapper.svelte";
    import TypedExampleWrapper from "./TypedExampleWrapper.svelte";

    const EXAMPLES_ROOT = "/src/App/Pages/PaintedTextPage/Examples";

    const fill = createPaintSlot(PaintedTextKnobs.STARTING_FILL_PAINT_KIND, PaintedTextKnobs.STARTING_KEYS);
    const stroke = createPaintSlot(PaintedTextKnobs.STARTING_STROKE_PAINT_KIND, PaintedTextKnobs.STARTING_KEYS);

    let width = $state(PaintedTextKnobs.STARTING_WIDTH);
    let strokeWidth = $state(PAINTED_TEXT_DEFAULTS.strokeWidth);
    let strokeAlignment = $state<PaintedTextStrokeAlignment>(PAINTED_TEXT_DEFAULTS.strokeAlignment);
    let blurWidth = $state(PaintedTextKnobs.STARTING_BLUR_WIDTH);
    let animationDurationMs = $state(PaintedTextKnobs.STARTING_DURATION_MS);
    let iterationConfigKey = $state<SVGDefsSamples.Iteration.SampleKey>(PaintedTextKnobs.STARTING_ITERATION_KEY);
    let cellSize = $state(PaintedTextKnobs.STARTING_CELL_SIZE);
    let colors = $state.raw<SVGDefsColors>({ ...SVGDefsSamples.SAMPLE_COLORS });

    const colorKeys = $derived(Object.keys(colors) as (keyof SVGDefsColors)[]);

    const usesPattern = $derived(getIsUsingKind([fill.paint, stroke.paint], ["pattern", "trackedPattern"]));
    const usesTiming = $derived(getIsUsingKind([fill.paint, stroke.paint], ["pattern", "timed"]));

    const commonProps: PaintedTextExampleWrapperProps = $derived({
        width,
        fillPaint: fill.paint,
        strokePaint: stroke.paint,
        strokeWidth,
        strokeAlignment,
        colors,
        blurWidth,
        animationDurationMs,
        iterationConfigKey,
        cellSize: { width: cellSize, height: cellSize },
    });

    const examples: ExampleDefs[] = [
        {
            key: "heading",
            name: "Heading",
            component: headingExample,
            path: `${EXAMPLES_ROOT}/Heading.svelte`,
        },
        {
            key: "paragraph",
            name: "Paragraph",
            readout: () =>
                "the text wraps where Typewriter would wrap it, the paint is sized to the whole block so one gradient runs across every line, and the image, the icon and the link are carried into the drawing",
            component: paragraphExample,
            path: `${EXAMPLES_ROOT}/Paragraph.svelte`,
        },
        {
            key: "customInput",
            name: "Custom Input",
            readout: () =>
                "the text box drives the painted text directly: every change to what it holds is laid out and painted again, line breaks included",
            component: customInputExample,
            path: `${EXAMPLES_ROOT}/CustomInput.svelte`,
        },
        {
            key: "typed",
            name: "Typed",
            readout: () =>
                "a Typewriter around two painted texts: it decides when each letter arrives and how, the painted texts decide where the letters sit and what paints them, and the two share one run in reading order",
            component: typedExample,
            path: `${EXAMPLES_ROOT}/Typed.svelte`,
        },
        {
            key: "scrambled",
            name: "Scrambled",
            readout: () =>
                "a ScrambleText around a painted text: it decides which glyph each letter shows while it churns, and the painted text draws that glyph, painted, in the letter's place",
            component: scrambledExample,
            path: `${EXAMPLES_ROOT}/Scrambled.svelte`,
        },
    ];
</script>

{#snippet headingExample()}
    <HeadingExampleWrapper {...commonProps} />
{/snippet}

{#snippet paragraphExample()}
    <ParagraphExampleWrapper {...commonProps} />
{/snippet}

{#snippet customInputExample()}
    <CustomInputExampleWrapper {...commonProps} />
{/snippet}

{#snippet typedExample()}
    <TypedExampleWrapper {...commonProps} />
{/snippet}

{#snippet scrambledExample()}
    <ScrambledExampleWrapper {...commonProps} />
{/snippet}

<div class={styles.root}>
    <PagePropsGroups>
        <PagePaintPicker
            paintSlot={fill}
            name={"fill"}
            label={"Fill"}
            hint={"What paints the letters: a flat color, a pattern, or a gradient that runs on a clock or follows the pointer. For hollow letters, paint them solid and make the background color transparent."}
        />

        <PagePropsDivider />

        <PagePaintPicker
            paintSlot={stroke}
            name={"stroke"}
            label={"Stroke"}
            hint={"What paints the stroke around the letters: a flat color, a pattern, or a gradient that runs on a clock or follows the pointer."}
        />

        <PagePropsDivider />

        <PagePropsPanel scope={"global"}>
            <PageProp
                itemKey={"strokeWidth"}
                label={"Stroke width (px)"}
                hint={"How wide the stroke appears, whichever side of the letter's edge it sits on."}
            >
                <PageNumberField
                    value={strokeWidth}
                    min={PaintedTextKnobs.MIN_STROKE_WIDTH}
                    max={PaintedTextKnobs.MAX_STROKE_WIDTH}
                    step={PaintedTextKnobs.STROKE_WIDTH_STEP}
                    ariaLabel={"Stroke width in pixels"}
                    onInput={(value) => {
                        strokeWidth = value;
                    }}
                />
            </PageProp>

            <PageProp
                itemKey={"strokeAlignment"}
                label={"Stroke alignment"}
                hint={"Where the stroke sits against the edge of each letter: outside keeps the letters their full shape, inside keeps the text its overall size, and center straddles the edge."}
            >
                <PageSelectField
                    value={strokeAlignment}
                    values={PaintedTextKnobs.STROKE_ALIGNMENTS}
                    ariaLabel={"Stroke alignment"}
                    onChange={(value) => {
                        strokeAlignment = value;
                    }}
                />
            </PageProp>

            <PageProp
                itemKey={"colors"}
                label={"Colors"}
                hint={"The colors the fill and the stroke are built from. Each sample uses as many as it needs."}
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

            <PageProp
                itemKey={"blurWidth"}
                label={"Blur (px)"}
                hint={"How far the paint is blurred outward, which is what gives it its glow."}
            >
                <PageNumberField
                    value={blurWidth}
                    min={PaintedTextKnobs.MIN_BLUR_WIDTH}
                    max={PaintedTextKnobs.MAX_BLUR_WIDTH}
                    step={PaintedTextKnobs.BLUR_WIDTH_STEP}
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
                    hint={"How long one pass of the fill or stroke animation takes."}
                >
                    <PageNumberField
                        value={animationDurationMs}
                        min={PaintedTextKnobs.MIN_DURATION_MS}
                        max={PaintedTextKnobs.MAX_DURATION_MS}
                        step={PaintedTextKnobs.DURATION_STEP_MS}
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

            {#if usesPattern}
                <PageProp
                    itemKey={"cellSize"}
                    label={"Pattern Cell Size (px)"}
                    hint={"How large one tile of a pattern is before it repeats."}
                >
                    <PageNumberField
                        value={cellSize}
                        min={PaintedTextKnobs.MIN_CELL_SIZE}
                        max={PaintedTextKnobs.MAX_CELL_SIZE}
                        step={PaintedTextKnobs.CELL_SIZE_STEP}
                        ariaLabel={"Pattern cell size"}
                        onInput={(value) => {
                            cellSize = value;
                        }}
                    />
                </PageProp>
            {/if}

            <PageProp
                itemKey={"width"}
                label={"Container width (px)"}
                hint={"How wide the box holding the text is, which decides where the lines wrap."}
            >
                <PageNumberField
                    value={width}
                    min={PaintedTextKnobs.MIN_CONTAINER_WIDTH}
                    max={PaintedTextKnobs.MAX_CONTAINER_WIDTH}
                    step={PaintedTextKnobs.CONTAINER_WIDTH_STEP}
                    ariaLabel={"Container width in pixels"}
                    onInput={(value) => {
                        width = value;
                    }}
                />
            </PageProp>
        </PagePropsPanel>
    </PagePropsGroups>

    <PageExamples items={examples} layout={"flow"} />
</div>
