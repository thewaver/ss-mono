<script lang="ts">
    import { SVGDefsSamples, TrackedPatternDefaults } from "@thewaver/ss-components-svelte";
    import {
        NO_SAMPLE_KEY,
        toGroupEntriesWithNoSample,
    } from "@thewaver/ss-playground/App/PageComponents/SampleGroups/SampleGroups.const";
    import type { WithNoSample } from "@thewaver/ss-playground/App/PageComponents/SampleGroups/SampleGroups.types";

    import { SVGPatternKnobs } from "../../../Knobs/SVGPatterns.const";
    import { TrackedPatternKnobs } from "../../../Knobs/TrackedPatterns.const";
    import type { ExampleDefs } from "../../../PageComponents/Examples/Examples.types";
    import PageExamples from "../../../PageComponents/Examples/PageExamples.svelte";
    import PageGroupedSelectField from "../../../PageComponents/Field/PageGroupedSelectField.svelte";
    import PageKnobs from "../../../PageComponents/Knobs/Knobs.svelte";
    import type { Knob } from "../../../PageComponents/Knobs/Knobs.types";
    import PageProp from "../../../PageComponents/Prop/Prop.svelte";
    import PagePropsDivider from "../../../PageComponents/PropsPanel/PagePropsDivider.svelte";
    import PagePropsGroups from "../../../PageComponents/PropsPanel/PagePropsGroups.svelte";
    import PagePropsPanel from "../../../PageComponents/PropsPanel/PagePropsPanel.svelte";
    import { GROUPPED_TRACKED_PATTERNS } from "../SVGPatterns.const";
    import type { TrackedPatternExampleProps } from "../SVGPatterns.types";
    import PageSVGPatternsProps from "../SVGPatternsProps.svelte";
    import DefaultExample from "./Examples/Default.svelte";

    const TRACKED_PATTERN_GROUPS = toGroupEntriesWithNoSample(GROUPPED_TRACKED_PATTERNS);

    const DEFAULT_EXAMPLE_PATH = "/src/App/Pages/SVGPatterns/TrackedPatternsPage/Examples/Default.svelte";

    let configKey = $state<WithNoSample<SVGDefsSamples.Pattern.Tracked.SampleKey>>(
        SVGPatternKnobs.STARTING_TRACKED_PATTERN_KEY,
    );
    let configDefsByKey = $state.raw<Record<string, Record<string, number | boolean>>>({});

    const knobs = $derived(
        configKey === NO_SAMPLE_KEY
            ? {}
            : (TrackedPatternKnobs.KNOBS_BY_FAMILY[configKey] as Record<string, Knob>),
    );
    const defaults = $derived(
        configKey === NO_SAMPLE_KEY
            ? {}
            : (TrackedPatternDefaults.DEFAULTS_BY_FAMILY[configKey] as Record<string, unknown>),
    );
    const configDefs = $derived(configDefsByKey[configKey] ?? {});
    let cellSize = $state(SVGPatternKnobs.STARTING_CELL_SIZE);
    let blurWidth = $state(SVGPatternKnobs.STARTING_BLUR_WIDTH);
    let colors = $state.raw({ ...SVGDefsSamples.SAMPLE_COLORS });

    const cellSize2d = $derived({ width: cellSize, height: cellSize });

    const commonProps: TrackedPatternExampleProps = $derived({
        configKey,
        configDefs,
        colors,
        cellSize: cellSize2d,
        blurWidth,
    });

    const examples: ExampleDefs[] = [
        {
            key: "default",
            name: "Default",
            readout: () =>
                "drag the corner to resize the box: drawn as one tile, the cell count follows the size; tiled, the copies appear and all of them react",
            component: defaultExample,
            path: DEFAULT_EXAMPLE_PATH,
        },
    ];
</script>

{#snippet defaultExample()}
    <DefaultExample {...commonProps} />
{/snippet}

<PagePropsGroups>
    <PagePropsPanel scope={"sample"}>
        <PageProp
            itemKey={"configKey"}
            label={"Pattern"}
            hint={"Which pointer-following pattern is shown. Choosing one brings its own knobs with it."}
        >
            <PageGroupedSelectField
                value={configKey}
                groups={TRACKED_PATTERN_GROUPS}
                ariaLabel={"Pattern"}
                onChange={(config) => (configKey = config)}
            />
        </PageProp>

        <PageKnobs
            {knobs}
            {defaults}
            values={configDefs}
            onInput={(key, value) =>
                (configDefsByKey = {
                    ...configDefsByKey,
                    [configKey]: { ...configDefsByKey[configKey], [key]: value },
                })}
        />
    </PagePropsPanel>

    <PagePropsDivider />

    <PagePropsPanel scope={"global"}>
        <PageSVGPatternsProps
            controls={{
                cellSize: [() => cellSize, (next) => (cellSize = next)],
                blurWidth: [() => blurWidth, (next) => (blurWidth = next)],
                colors,
                setColor: (key, value) => (colors = { ...colors, [key]: value }),
            }}
        />
    </PagePropsPanel>
</PagePropsGroups>

<PageExamples items={examples} layout={"flow"} />
