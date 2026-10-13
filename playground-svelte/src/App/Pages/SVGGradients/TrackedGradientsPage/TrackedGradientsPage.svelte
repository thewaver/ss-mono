<script lang="ts">
    import { SVGDefsSamples, TrackedGradientDefaults } from "@thewaver/ss-components-svelte";
    import { NO_SAMPLE_KEY } from "@thewaver/ss-playground/App/PageComponents/SampleGroups/SampleGroups.const";
    import type { WithNoSample } from "@thewaver/ss-playground/App/PageComponents/SampleGroups/SampleGroups.types";

    import { SVGGradientKnobs } from "@thewaver/ss-playground/App/Knobs/SVGGradients.const";
    import { TrackedGradientKnobs } from "@thewaver/ss-playground/App/Knobs/TrackedGradients.const";
    import type { ExampleDefs } from "../../../PageComponents/Examples/Examples.types";
    import PageExamples from "../../../PageComponents/Examples/PageExamples.svelte";
    import PageGroupedSelectField from "../../../PageComponents/Field/PageGroupedSelectField.svelte";
    import PageKnobs from "../../../PageComponents/Knobs/Knobs.svelte";
    import type { Knob } from "../../../PageComponents/Knobs/Knobs.types";
    import PageProp from "../../../PageComponents/Prop/Prop.svelte";
    import PagePropsDivider from "../../../PageComponents/PropsPanel/PagePropsDivider.svelte";
    import PagePropsGroups from "../../../PageComponents/PropsPanel/PagePropsGroups.svelte";
    import PagePropsPanel from "../../../PageComponents/PropsPanel/PagePropsPanel.svelte";
    import type { SVGGradientsPaintKind, TrackedGradientExampleProps } from "../SVGGradientsSvelte.types";
    import PageSVGGradientsProps from "../SVGGradientsProps.svelte";
    import ContinuityExample from "./Examples/Continuity.svelte";
    import DefaultExample from "./Examples/Default.svelte";
    import ScreenOverlayExample from "./Examples/ScreenOverlay.svelte";
    import SharedExample from "./Examples/Shared.svelte";
    import {
    EXAMPLE_NAMES,
    EXAMPLES_ROOT,
    TRACKED_GRADIENT_GROUPS,
} from "@thewaver/ss-playground/App/Pages/SVGGradients/TrackedGradientsPage/TrackedGradientsPage.const";

    let configKey = $state<WithNoSample<SVGDefsSamples.Gradient.Tracked.SampleKey>>(
        SVGGradientKnobs.STARTING_TRACKED_GRADIENT_KEY,
    );
    let configDefsByKey = $state.raw<Record<string, Record<string, number | boolean>>>({});

    const knobs = $derived(
        configKey === NO_SAMPLE_KEY
            ? {}
            : (TrackedGradientKnobs.KNOBS_BY_FAMILY[configKey] as Record<string, Knob>),
    );
    const defaults = $derived(
        configKey === NO_SAMPLE_KEY
            ? {}
            : (TrackedGradientDefaults.DEFAULTS_BY_FAMILY[configKey] as Record<string, unknown>),
    );
    const configDefs = $derived(configDefsByKey[configKey] ?? {});
    let paintKind = $state<SVGGradientsPaintKind>(SVGGradientKnobs.STARTING_PAINT_KIND);
    let blurWidth = $state(SVGGradientKnobs.STARTING_BLUR_WIDTH);
    let colors = $state.raw({ ...SVGDefsSamples.SAMPLE_COLORS });

    const commonProps: TrackedGradientExampleProps = $derived({
        configDefs,
        configKey,
        paintKind,
        colors,
        blurWidth,
    });

    const examples: ExampleDefs[] = [
        {
            key: "default",
            name: EXAMPLE_NAMES.default,
            component: defaultExample,
            path: `${EXAMPLES_ROOT}/Default.svelte`,
        },
        {
            key: "continuity",
            name: EXAMPLE_NAMES.continuity,
            readout: () => "four boxes, each reading the pointer against its own — a pool spans them, a hand does not",
            component: continuityExample,
            path: `${EXAMPLES_ROOT}/Continuity.svelte`,
        },
        {
            key: "shared",
            name: EXAMPLE_NAMES.shared,
            readout: () =>
                "the same four boxes, now reading the pointer against the group and painting one gradient laid across all of it, so each box shows its own part of a single picture",
            component: sharedExample,
            path: `${EXAMPLES_ROOT}/Shared.svelte`,
        },
        {
            key: "screenOverlay",
            name: EXAMPLE_NAMES.screenOverlay,
            readout: () =>
                "the gradient on a layer over the whole window, following the pointer everywhere; clicks pass through it, a button in the top-right corner closes it, and its sizes are a quarter of what the knobs say, since the box it fills is the whole window",
            component: screenOverlayExample,
            path: `${EXAMPLES_ROOT}/ScreenOverlay.svelte`,
        },
    ];
</script>

{#snippet defaultExample()}
    <DefaultExample {...commonProps} />
{/snippet}

{#snippet continuityExample()}
    <ContinuityExample {...commonProps} />
{/snippet}

{#snippet sharedExample()}
    <SharedExample {...commonProps} />
{/snippet}

{#snippet screenOverlayExample()}
    <ScreenOverlayExample {...commonProps} />
{/snippet}

<PagePropsGroups>
    <PagePropsPanel scope={"sample"}>
        <PageProp
            itemKey={"configKey"}
            label={"Gradient"}
            hint={"Which pointer-following gradient is shown. Choosing one brings its own knobs with it."}
        >
            <PageGroupedSelectField
                value={configKey}
                groups={TRACKED_GRADIENT_GROUPS}
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
    </PagePropsPanel>
</PagePropsGroups>

<PageExamples items={examples} layout={"flow"} />
