<script lang="ts">
    import { SVGDefsSamples, TimedGradientDefaults } from "@thewaver/ss-components-svelte";
    import {
        NO_SAMPLE_KEY,
        toGroupEntriesWithNoSample,
    } from "@thewaver/ss-playground/App/PageComponents/SampleGroups/SampleGroups.const";
    import type { WithNoSample } from "@thewaver/ss-playground/App/PageComponents/SampleGroups/SampleGroups.types";

    import { SVGGradientKnobs } from "../../../Knobs/SVGGradients.const";
    import { TimedGradientKnobs } from "../../../Knobs/TimedGradients.const";
    import type { ExampleDefs } from "../../../PageComponents/Examples/Examples.types";
    import PageExamples from "../../../PageComponents/Examples/PageExamples.svelte";
    import PageGroupedSelectField from "../../../PageComponents/Field/PageGroupedSelectField.svelte";
    import PageNumberField from "../../../PageComponents/Field/PageNumberField.svelte";
    import PageSelectField from "../../../PageComponents/Field/PageSelectField.svelte";
    import PageKnobs from "../../../PageComponents/Knobs/Knobs.svelte";
    import type { Knob } from "../../../PageComponents/Knobs/Knobs.types";
    import PageProp from "../../../PageComponents/Prop/Prop.svelte";
    import PagePropsDivider from "../../../PageComponents/PropsPanel/PagePropsDivider.svelte";
    import PagePropsGroups from "../../../PageComponents/PropsPanel/PagePropsGroups.svelte";
    import PagePropsPanel from "../../../PageComponents/PropsPanel/PagePropsPanel.svelte";
    import { GROUPPED_TIMED_GRADIENTS } from "../SVGGradients.const";
    import type { SVGGradientsPaintKind, TimedGradientExampleProps } from "../SVGGradients.types";
    import PageSVGGradientsProps from "../SVGGradientsProps.svelte";
    import DefaultExample from "./Examples/Default.svelte";

    const DEFAULT_EXAMPLE_PATH = "/src/App/Pages/SVGGradients/TimedGradientsPage/Examples/Default.svelte";

    const TIMED_GRADIENT_GROUPS = toGroupEntriesWithNoSample(GROUPPED_TIMED_GRADIENTS);

    let configKey = $state<WithNoSample<SVGDefsSamples.Gradient.Timed.SampleKey>>(
        SVGGradientKnobs.STARTING_TIMED_GRADIENT_KEY,
    );
    let configDefsByKey = $state.raw<Record<string, Record<string, number | boolean>>>({});

    const knobs = $derived(
        configKey === NO_SAMPLE_KEY ? {} : (TimedGradientKnobs.KNOBS_BY_FAMILY[configKey] as Record<string, Knob>),
    );
    const defaults = $derived(
        configKey === NO_SAMPLE_KEY
            ? {}
            : (TimedGradientDefaults.DEFAULTS_BY_FAMILY[configKey] as Record<string, unknown>),
    );
    const configDefs = $derived(configDefsByKey[configKey] ?? {});
    let iterationConfigKey = $state<SVGDefsSamples.Iteration.SampleKey>(SVGGradientKnobs.STARTING_ITERATION_KEY);
    let animationDurationMs = $state(SVGGradientKnobs.STARTING_DURATION_MS);
    let paintKind = $state<SVGGradientsPaintKind>(SVGGradientKnobs.STARTING_PAINT_KIND);
    let blurWidth = $state(SVGGradientKnobs.STARTING_BLUR_WIDTH);
    let colors = $state.raw({ ...SVGDefsSamples.SAMPLE_COLORS });

    const commonProps: TimedGradientExampleProps = $derived({
        configDefs,
        configKey,
        paintKind,
        iterationConfigKey,
        animationDurationMs,
        colors,
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

<PagePropsGroups>
    <PagePropsPanel scope={"sample"}>
        <PageProp
            itemKey={"configKey"}
            label={"Gradient"}
            hint={"Which animated gradient is shown. Choosing one brings its own knobs with it."}
        >
            <PageGroupedSelectField
                value={configKey}
                groups={TIMED_GRADIENT_GROUPS}
                ariaLabel={"Gradient"}
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
        <PageSVGGradientsProps
            controls={{
                paintKind: [() => paintKind, (next) => (paintKind = next)],
                blurWidth: [() => blurWidth, (next) => (blurWidth = next)],
                colors,
                setColor: (key, value) => (colors = { ...colors, [key]: value }),
            }}
        />

        <PageProp
            itemKey={"animationDurationMs"}
            label={"Animation duration (ms)"}
            hint={"How long one pass of the gradient's animation takes."}
        >
            <PageNumberField
                value={animationDurationMs}
                min={SVGGradientKnobs.MIN_DURATION_MS}
                max={SVGGradientKnobs.MAX_DURATION_MS}
                step={SVGGradientKnobs.DURATION_STEP_MS}
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
</PagePropsGroups>

<PageExamples items={examples} layout={"flow"} />
