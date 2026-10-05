<script lang="ts">
    import {
        FORMATION_DEFAULTS,
        PlacementLayoutDefaults,
        PlacementLayouts,
        ProximityEffectDefaults,
        ProximityEffects,
    } from "@thewaver/ss-components-svelte";
    import type { PlacementLayoutEntry, ProximityEffectEntry } from "@thewaver/ss-components-svelte";
    import { NO_SAMPLE_KEY } from "@thewaver/ss-playground/App/PageComponents/SampleGroups/SampleGroups.const";
    import type { WithNoSample } from "@thewaver/ss-playground/App/PageComponents/SampleGroups/SampleGroups.types";
    import { ShapeConst } from "@thewaver/ss-utils";

    import { FormationKnobs } from "../../Knobs/Formations.const";
    import { PlacementLayoutKnobs } from "../../Knobs/PlacementLayouts.const";
    import { ProximityEffectKnobs } from "../../Knobs/ProximityEffects.const";
    import type { ExampleDefs } from "../../PageComponents/Examples/Examples.types";
    import PageExamples from "../../PageComponents/Examples/PageExamples.svelte";
    import PageCheckField from "../../PageComponents/Field/PageCheckField.svelte";
    import PageNumberField from "../../PageComponents/Field/PageNumberField.svelte";
    import PageSelectField from "../../PageComponents/Field/PageSelectField.svelte";
    import PageKnobs from "../../PageComponents/Knobs/Knobs.svelte";
    import type { Knob } from "../../PageComponents/Knobs/Knobs.types";
    import PageProp from "../../PageComponents/Prop/Prop.svelte";
    import PagePropsDivider from "../../PageComponents/PropsPanel/PagePropsDivider.svelte";
    import PagePropsGroups from "../../PageComponents/PropsPanel/PagePropsGroups.svelte";
    import PagePropsPanel from "../../PageComponents/PropsPanel/PagePropsPanel.svelte";
    import DefaultExampleWrapper from "./DefaultExampleWrapper.svelte";
    import type { FormationExampleProps } from "./FormationPage.types";

    const FIELD_WIDTH = 130;
    const EXAMPLES_ROOT = "/src/App/Pages/FormationPage/Examples";

    const NAMES = [
        "Aurora",
        "Basalt",
        "Cinder",
        "Drift",
        "Ember",
        "Fathom",
        "Glimmer",
        "Hollow",
        "Iris",
        "Jetty",
        "Kelp",
        "Loam",
    ];

    const NO_DEFS: Record<string, number | boolean> = {};

    let itemCount = $state(FormationKnobs.STARTING_ITEM_COUNT);
    let skippedCount = $state(FormationKnobs.MIN_SKIPPED_COUNT);
    let layoutKey = $state<PlacementLayouts.SampleKey>(FormationKnobs.STARTING_LAYOUT_KEY);
    let effectKey = $state<WithNoSample<ProximityEffects.SampleKey>>(FormationKnobs.STARTING_EFFECT_KEY);
    let shapeKind = $state<ShapeConst.DefaultShape>(FormationKnobs.STARTING_SHAPE_KIND);
    let isStackedInReverse = $state(FormationKnobs.STARTING_IS_STACKED_IN_REVERSE);
    let transitionDurationMs = $state(FORMATION_DEFAULTS.transitionDurationMs);
    let transitionDelayMs = $state(FORMATION_DEFAULTS.transitionDelayMs);
    let layoutDefs = $state.raw<Record<string, Record<string, number | boolean>>>({});
    let effectDefs = $state.raw<Record<string, Record<string, number | boolean>>>({});

    const family = $derived(PlacementLayouts.SAMPLE_LAYOUTS[layoutKey].family);
    const knobs = $derived(PlacementLayoutKnobs.KNOBS_BY_FAMILY[family] as Record<string, Knob>);
    const defaults = $derived(PlacementLayoutDefaults.DEFAULTS_BY_FAMILY[family] as Record<string, unknown>);
    const defs = $derived(layoutDefs[layoutKey] ?? NO_DEFS);

    const layoutEntry = $derived({ family, defs } as unknown as PlacementLayoutEntry);

    const effectFamily = $derived(
        effectKey === NO_SAMPLE_KEY ? undefined : ProximityEffects.SAMPLE_EFFECTS[effectKey].family,
    );

    const effectKnobs = $derived(
        (effectFamily === undefined ? {} : ProximityEffectKnobs.KNOBS_BY_FAMILY[effectFamily]) as Record<string, Knob>,
    );

    const effectDefaults = $derived(
        (effectFamily === undefined
            ? {}
            : ProximityEffectDefaults.DEFAULTS_BY_FAMILY[effectFamily]) as Record<string, unknown>,
    );

    const pickedEffectDefs = $derived(effectDefs[effectKey] ?? NO_DEFS);

    const effectEntry = $derived(
        effectFamily === undefined
            ? undefined
            : ({ family: effectFamily, defs: pickedEffectDefs } as unknown as ProximityEffectEntry),
    );

    const items = $derived(NAMES.slice(skippedCount, skippedCount + itemCount));

    const commonProps: FormationExampleProps = $derived({
        items,
        isStackedInReverse,
        layoutEntry,
        effectEntry,
        shapeKind,
        transitionDurationMs,
        transitionDelayMs,
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

<PagePropsGroups>
    <PagePropsPanel scope={"sample"}>
        <PageProp
            itemKey={"layoutKey"}
            label={"Arrangement"}
            hint={
                "How the items are arranged: a ring, an arc, a row, a honeycomb, and so on. Choosing one brings its own knobs with it."
            }
        >
            <PageSelectField
                value={layoutKey}
                values={PlacementLayouts.SAMPLE_KEYS}
                width={FIELD_WIDTH}
                ariaLabel={"Arrangement"}
                onChange={(value) => {
                    layoutKey = value;
                }}
            />
        </PageProp>

        <PageKnobs
            {knobs}
            {defaults}
            values={defs}
            width={FIELD_WIDTH}
            onInput={(key, value) => {
                layoutDefs = { ...layoutDefs, [layoutKey]: { ...layoutDefs[layoutKey], [key]: value } };
            }}
        />
    </PagePropsPanel>

    <PagePropsDivider />

    <PagePropsPanel scope={"sample"}>
        <PageProp
            itemKey={"effectKey"}
            label={"Pointer effect"}
            hint={"What the items do as the pointer nears them. Choosing one brings its own knobs with it."}
        >
            <PageSelectField
                value={effectKey}
                values={FormationKnobs.EFFECT_KEYS}
                width={FIELD_WIDTH}
                ariaLabel={"Pointer effect"}
                onChange={(value) => {
                    effectKey = value;
                }}
            />
        </PageProp>

        <PageKnobs
            knobs={effectKnobs}
            defaults={effectDefaults}
            values={pickedEffectDefs}
            width={FIELD_WIDTH}
            onInput={(key, value) => {
                effectDefs = { ...effectDefs, [effectKey]: { ...effectDefs[effectKey], [key]: value } };
            }}
        />
    </PagePropsPanel>

    <PagePropsDivider />

    <PagePropsPanel scope={"global"}>
        <PageProp itemKey={"itemCount"} label={"Items"} hint={"How many items the arrangement holds."}>
            <PageNumberField
                value={itemCount}
                min={FormationKnobs.MIN_ITEM_COUNT}
                max={FormationKnobs.MAX_ITEM_COUNT}
                step={FormationKnobs.ITEM_COUNT_STEP}
                width={FIELD_WIDTH}
                ariaLabel={"Items"}
                onInput={(value) => {
                    itemCount = value;
                }}
            />
        </PageProp>

        <PageProp
            itemKey={"skippedCount"}
            label={"Skip from the start"}
            hint={
                "Leaves out that many items from the front of the list, so an item can be taken out from the start rather than the end."
            }
        >
            <PageNumberField
                value={skippedCount}
                min={FormationKnobs.MIN_SKIPPED_COUNT}
                max={NAMES.length - FormationKnobs.MIN_ITEM_COUNT}
                step={FormationKnobs.ITEM_COUNT_STEP}
                width={FIELD_WIDTH}
                ariaLabel={"Skip from the start"}
                onInput={(value) => {
                    skippedCount = value;
                }}
            />
        </PageProp>

        <PageProp
            itemKey={"isStackedInReverse"}
            label={"Earlier items in front"}
            hint={"Puts the first item on top of the pile instead of the last, which shows where two items overlap."}
        >
            <PageCheckField
                value={isStackedInReverse}
                ariaLabel={"Earlier items in front"}
                onChange={(value) => {
                    isStackedInReverse = value;
                }}
            />
        </PageProp>

        <PageProp itemKey={"shapeKind"} label={"Item shape"} hint={"The contour each item is cut to."}>
            <PageSelectField
                value={shapeKind}
                values={ShapeConst.DEFAULT_SHAPES}
                width={FIELD_WIDTH}
                ariaLabel={"Item shape"}
                onChange={(value) => {
                    shapeKind = value;
                }}
            />
        </PageProp>

        <PageProp
            itemKey={"transitionDurationMs"}
            label={"Glide (ms)"}
            hint={
                "How long an item takes to glide to its new place when the arrangement, the item count or a knob changes. At 0 it moves at once, and under reduced motion it always does."
            }
        >
            <PageNumberField
                value={transitionDurationMs}
                min={FormationKnobs.MIN_DURATION_MS}
                max={FormationKnobs.MAX_DURATION_MS}
                step={FormationKnobs.DURATION_STEP_MS}
                width={FIELD_WIDTH}
                ariaLabel={"Glide duration in milliseconds"}
                onInput={(value) => {
                    transitionDurationMs = value;
                }}
            />
        </PageProp>

        <PageProp
            itemKey={"transitionDelayMs"}
            label={"Transition delay (ms)"}
            hint={"How much later each item sets off than the one before it, while gliding is on."}
        >
            <PageNumberField
                value={transitionDelayMs}
                min={FormationKnobs.MIN_STAGGER_MS}
                max={FormationKnobs.MAX_STAGGER_MS}
                step={FormationKnobs.STAGGER_STEP_MS}
                width={FIELD_WIDTH}
                ariaLabel={"Transition delay in milliseconds"}
                onInput={(value) => {
                    transitionDelayMs = value;
                }}
            />
        </PageProp>
    </PagePropsPanel>
</PagePropsGroups>

<PageExamples items={examples} layout={"flow"} />
