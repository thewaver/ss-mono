<script lang="ts">
    import { SVGDefsSamples } from "@thewaver/ss-components-svelte";
    import { toGroupEntriesWithNoSample } from "@thewaver/ss-playground/App/PageComponents/SampleGroups/SampleGroups.const";
    import type { WithNoSample } from "@thewaver/ss-playground/App/PageComponents/SampleGroups/SampleGroups.types";

    import { SVGPatternKnobs } from "../../../Knobs/SVGPatterns.const";
    import type { ExampleDefs } from "../../../PageComponents/Examples/Examples.types";
    import PageExamples from "../../../PageComponents/Examples/PageExamples.svelte";
    import PageGroupedSelectField from "../../../PageComponents/Field/PageGroupedSelectField.svelte";
    import PageNumberField from "../../../PageComponents/Field/PageNumberField.svelte";
    import PageSelectField from "../../../PageComponents/Field/PageSelectField.svelte";
    import PageProp from "../../../PageComponents/Prop/Prop.svelte";
    import PagePropsPanel from "../../../PageComponents/PropsPanel/PagePropsPanel.svelte";
    import { GROUPPED_TIMED_PATTERNS } from "../SVGPatterns.const";
    import type { TimedPatternExampleProps } from "../SVGPatterns.types";
    import PageSVGPatternsProps from "../SVGPatternsProps.svelte";
    import DefaultExample from "./Examples/Default.svelte";

    const TIMED_PATTERN_GROUPS = toGroupEntriesWithNoSample(GROUPPED_TIMED_PATTERNS);

    const DEFAULT_EXAMPLE_PATH = "/src/App/Pages/SVGPatterns/TimedPatternsPage/Examples/Default.svelte";

    let configKey = $state<WithNoSample<SVGDefsSamples.Pattern.Timed.SampleKey>>(
        SVGPatternKnobs.STARTING_TIMED_PATTERN_KEY,
    );
    let iterationConfigKey = $state<SVGDefsSamples.Iteration.SampleKey>(SVGPatternKnobs.STARTING_ITERATION_KEY);
    let animationDurationMs = $state(SVGPatternKnobs.STARTING_DURATION_MS);
    let cellSize = $state(SVGPatternKnobs.STARTING_CELL_SIZE);
    let blurWidth = $state(SVGPatternKnobs.STARTING_BLUR_WIDTH);
    let colors = $state.raw({ ...SVGDefsSamples.SAMPLE_COLORS });

    const cellSize2d = $derived({ width: cellSize, height: cellSize });

    const commonProps: TimedPatternExampleProps = $derived({
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
            groups={TIMED_PATTERN_GROUPS}
            ariaLabel={"Pattern"}
            onChange={(config) => (configKey = config)}
        />
    </PageProp>

    <PageSVGPatternsProps
        controls={{
            cellSize: [() => cellSize, (next) => (cellSize = next)],
            blurWidth: [() => blurWidth, (next) => (blurWidth = next)],
            colors,
            setColor: (key, value) => (colors = { ...colors, [key]: value }),
        }}
    />

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
