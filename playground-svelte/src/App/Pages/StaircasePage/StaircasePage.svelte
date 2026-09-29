<script lang="ts">
    import { STAIRCASE_DEFAULTS, STAIRCASE_DIRS, StaircaseIndents } from "@thewaver/ss-components-svelte";
    import type { StaircaseDir } from "@thewaver/ss-components-svelte";
    import { StaircaseKnobs } from "@thewaver/ss-playground/App/Knobs/Staircases.const";

    import type { ExampleDefs } from "../../PageComponents/Examples/Examples.types";
    import PageExamples from "../../PageComponents/Examples/PageExamples.svelte";
    import PageNumberField from "../../PageComponents/Field/PageNumberField.svelte";
    import PageSelectField from "../../PageComponents/Field/PageSelectField.svelte";
    import PageProp from "../../PageComponents/Prop/Prop.svelte";
    import PagePropsPanel from "../../PageComponents/PropsPanel/PagePropsPanel.svelte";
    import DefaultExampleWrapper from "./DefaultExampleWrapper.svelte";
    import type { StaircaseExampleProps } from "./StaircasePage.types";

    const FIELD_WIDTH = 110;
    const EXAMPLES_ROOT = "/src/App/Pages/StaircasePage/Examples";

    const STAGES = [
        "Visitors",
        "Signed up",
        "Activated",
        "Subscribed",
        "Renewed",
        "Advocates",
        "Champions",
        "Partners",
        "Investors",
        "Founders",
    ];

    let stepCount = $state(StaircaseKnobs.STARTING_STEP_COUNT);
    let indent = $state(StaircaseKnobs.STARTING_INDENT);
    let gap = $state(STAIRCASE_DEFAULTS.gap);
    let indentKey = $state<StaircaseIndents.SampleKey>(StaircaseKnobs.STARTING_INDENT_KEY);
    let dir = $state<StaircaseDir>(STAIRCASE_DEFAULTS.dir);

    const steps = $derived(STAGES.slice(0, stepCount));

    const commonProps: StaircaseExampleProps = $derived({
        steps,
        indent,
        gap,
        dir,
        indentKey,
    });

    const examples: ExampleDefs[] = [
        {
            key: "default",
            name: "Default",
            component: defaultExample,
            path: `${EXAMPLES_ROOT}/Default.svelte`,
        },
    ];
</script>

{#snippet defaultExample()}
    <DefaultExampleWrapper {...commonProps} />
{/snippet}

<PagePropsPanel scope={"global"}>
    <PageProp itemKey={"stepCount"} label={"Steps"} hint={"How many steps the staircase holds."}>
        <PageNumberField
            value={stepCount}
            min={StaircaseKnobs.MIN_STEP_COUNT}
            max={StaircaseKnobs.MAX_STEP_COUNT}
            step={StaircaseKnobs.STEP_COUNT_STEP}
            width={FIELD_WIDTH}
            ariaLabel={"Steps"}
            onInput={(value) => {
                stepCount = value;
            }}
        />
    </PageProp>

    <PageProp itemKey={"indent"} label={"Indent (px)"} hint={"How far one step is set in from the one before it."}>
        <PageNumberField
            value={indent}
            min={StaircaseKnobs.MIN_INDENT}
            max={StaircaseKnobs.MAX_INDENT}
            step={StaircaseKnobs.INDENT_STEP}
            width={FIELD_WIDTH}
            ariaLabel={"Indent"}
            onInput={(value) => {
                indent = value;
            }}
        />
    </PageProp>

    <PageProp itemKey={"gap"} label={"Gap (px)"} hint={"The space between one step and the next."}>
        <PageNumberField
            value={gap}
            min={StaircaseKnobs.MIN_GAP}
            max={StaircaseKnobs.MAX_GAP}
            step={StaircaseKnobs.GAP_STEP}
            width={FIELD_WIDTH}
            ariaLabel={"Gap"}
            onInput={(value) => {
                gap = value;
            }}
        />
    </PageProp>

    <PageProp itemKey={"dir"} label={"Direction"} hint={"Which way the staircase runs."}>
        <PageSelectField
            value={dir}
            values={STAIRCASE_DIRS}
            width={FIELD_WIDTH}
            ariaLabel={"Direction"}
            onChange={(value) => {
                dir = value;
            }}
        />
    </PageProp>

    <PageProp
        itemKey={"indentKey"}
        label={"Indent function"}
        hint={"How the indent grows down the run: evenly, faster and faster, or in and out again."}
    >
        <PageSelectField
            value={indentKey}
            values={StaircaseIndents.SAMPLE_KEYS}
            width={FIELD_WIDTH}
            ariaLabel={"Indent function"}
            onChange={(value) => {
                indentKey = value;
            }}
        />
    </PageProp>
</PagePropsPanel>

<PageExamples items={examples} layout={"flow"} />
