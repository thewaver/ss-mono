<script lang="ts">
    import { SVGDefsSamples } from "@thewaver/ss-components-svelte";
    import {
        splitEntriesIntoGroups,
        toGroupEntriesWithNoSample,
    } from "@thewaver/ss-playground/App/PageComponents/SampleGroups/SampleGroups.const";
    import type { WithNoSample } from "@thewaver/ss-playground/App/PageComponents/SampleGroups/SampleGroups.types";
    import * as styles from "@thewaver/ss-playground/App/Pages/SVGPatternsPage/SVGPatternsPage.css";

    import { SVGPatternKnobs } from "../../Knobs/SVGPatterns.const";
    import type { ExampleDefs } from "../../PageComponents/Examples/Examples.types";
    import PageExamples from "../../PageComponents/Examples/PageExamples.svelte";
    import PageColorField from "../../PageComponents/Field/PageColorField.svelte";
    import PageGroupedSelectField from "../../PageComponents/Field/PageGroupedSelectField.svelte";
    import PageNumberField from "../../PageComponents/Field/PageNumberField.svelte";
    import PageSelectField from "../../PageComponents/Field/PageSelectField.svelte";
    import PageProp from "../../PageComponents/Prop/Prop.svelte";
    import PagePropsPanel from "../../PageComponents/PropsPanel/PagePropsPanel.svelte";
    import DefaultExample from "./Examples/Default.svelte";
    import type { SVGPatternsExampleProps } from "./SVGPatternsPage.types";

    const GROUPPED_PATTERNS = splitEntriesIntoGroups(SVGDefsSamples.Pattern.SAMPLE_CONFIGS);
    const PATTERN_GROUPS = toGroupEntriesWithNoSample(GROUPPED_PATTERNS);

    const DEFAULT_EXAMPLE_PATH = "/src/App/Pages/SVGPatternsPage/Examples/Default.svelte";

    let configKey = $state<WithNoSample<SVGDefsSamples.Pattern.SampleKey>>(SVGPatternKnobs.STARTING_PATTERN_KEY);
    let iterationConfigKey = $state<SVGDefsSamples.Iteration.SampleKey>(SVGPatternKnobs.STARTING_ITERATION_KEY);
    let animationDurationMs = $state(SVGPatternKnobs.STARTING_DURATION_MS);
    let cellSize = $state(SVGPatternKnobs.STARTING_CELL_SIZE);
    let blurWidth = $state(SVGPatternKnobs.STARTING_BLUR_WIDTH);
    let colors = $state.raw({ ...SVGDefsSamples.SAMPLE_COLORS });

    const colorKeys = $derived(Object.keys(colors) as (keyof typeof colors)[]);

    const cellSize2d = $derived({ width: cellSize, height: cellSize });

    const commonProps: SVGPatternsExampleProps = $derived({
        configKey,
        iterationConfigKey,
        animationDurationMs,
        colors,
        cellSize: cellSize2d,
        blurWidth,
    });

    const examples: ExampleDefs[] = [
        {
            key: "default",
            name: "Default",
            component: defaultExample,
            path: DEFAULT_EXAMPLE_PATH,
        },
    ];
</script>

{#snippet defaultExample()}
    <DefaultExample {...commonProps} />
{/snippet}

<PagePropsPanel scope={"global"}>
    <PageProp itemKey={"configKey"} label={"Pattern"} hint={"Which repeating pattern is shown."}>
        <PageGroupedSelectField
            value={configKey}
            groups={PATTERN_GROUPS}
            ariaLabel={"Pattern"}
            onChange={(config) => (configKey = config)}
        />
    </PageProp>

    <PageProp
        itemKey={"cellSize"}
        label={"Cell Size (px)"}
        hint={"How large one tile of the pattern is before it repeats."}
    >
        <PageNumberField
            value={cellSize}
            min={SVGPatternKnobs.MIN_CELL_SIZE}
            max={SVGPatternKnobs.MAX_CELL_SIZE}
            step={SVGPatternKnobs.CELL_SIZE_STEP}
            ariaLabel={"Cell size"}
            onInput={(value) => (cellSize = value)}
        />
    </PageProp>

    <PageProp
        itemKey={"colors"}
        label={"Colors"}
        hint={"The colors the pattern is drawn from. Each sample uses as many of them as it needs."}
    >
        <div class={styles.colorList}>
            {#each colorKeys as key (key)}
                <PageColorField
                    value={colors[key]}
                    ariaLabel={key}
                    onInput={(value) => (colors = { ...colors, [key]: value })}
                />
            {/each}
        </div>
    </PageProp>

    <PageProp
        itemKey={"blurWidth"}
        label={"Blur (px)"}
        hint={"How far the pattern is blurred outward, which is what gives it its glow."}
    >
        <PageNumberField
            value={blurWidth}
            min={SVGPatternKnobs.MIN_BLUR_WIDTH}
            max={SVGPatternKnobs.MAX_BLUR_WIDTH}
            step={SVGPatternKnobs.BLUR_WIDTH_STEP}
            ariaLabel={"Blur width"}
            onInput={(value) => (blurWidth = value)}
        />
    </PageProp>

    <PageProp
        itemKey={"animationDurationMs"}
        label={"Animation duration (ms)"}
        hint={"How long one pass of the pattern's animation takes."}
    >
        <PageNumberField
            value={animationDurationMs}
            min={SVGPatternKnobs.MIN_DURATION_MS}
            max={SVGPatternKnobs.MAX_DURATION_MS}
            step={SVGPatternKnobs.DURATION_STEP_MS}
            ariaLabel={"Animation duration"}
            onInput={(value) => (animationDurationMs = value)}
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
            onChange={(config) => (iterationConfigKey = config)}
        />
    </PageProp>
</PagePropsPanel>

<PageExamples items={examples} layout={"flow"} />
