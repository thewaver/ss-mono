<script lang="ts">
    import {
        CorridorLayoutDefaults,
        CorridorLayoutUtils,
        CorridorLayouts,
        INFINITE_CORRIDOR_DEFAULTS,
    } from "@thewaver/ss-components-svelte";
    import type { CorridorLayoutEntry } from "@thewaver/ss-components-svelte";
    import { CorridorLayoutKnobs } from "@thewaver/ss-playground/App/Knobs/CorridorLayouts.const";
    import { InfiniteCorridorKnobs } from "@thewaver/ss-playground/App/Knobs/InfiniteCorridors.const";
    import {
        EXAMPLE_NAMES,
        EXAMPLES_ROOT,
        FIELD_WIDTH,
        LAYOUT_FIELD_WIDTH,
        toRoomName,
    } from "@thewaver/ss-playground/App/Pages/InfiniteCorridorPage/InfiniteCorridorPage.const";

    import type { ExampleDefs } from "../../PageComponents/Examples/Examples.types";
    import PageExamples from "../../PageComponents/Examples/PageExamples.svelte";
    import PageNumberField from "../../PageComponents/Field/PageNumberField.svelte";
    import PageSelectField from "../../PageComponents/Field/PageSelectField.svelte";
    import PageKnobs from "../../PageComponents/Knobs/Knobs.svelte";
    import type { Knob } from "../../PageComponents/Knobs/Knobs.types";
    import PageProp from "../../PageComponents/Prop/Prop.svelte";
    import PagePropsDivider from "../../PageComponents/PropsPanel/PagePropsDivider.svelte";
    import PagePropsGroups from "../../PageComponents/PropsPanel/PagePropsGroups.svelte";
    import PagePropsPanel from "../../PageComponents/PropsPanel/PagePropsPanel.svelte";
    import ClockExampleWrapper from "./ClockExampleWrapper.svelte";
    import ScrolledExampleWrapper from "./ScrolledExampleWrapper.svelte";
    import type { InfiniteCorridorExampleProps } from "./InfiniteCorridorPageSvelte.types";

    const NO_DEFS = {};

    let layoutKey = $state<CorridorLayouts.SampleKey>(InfiniteCorridorKnobs.STARTING_LAYOUT);
    let itemCount = $state(InfiniteCorridorKnobs.STARTING_ITEM_COUNT);
    let glideDurationMs = $state(INFINITE_CORRIDOR_DEFAULTS.glideDurationMs);
    let spinDegreesPerSecond = $state(CorridorLayoutKnobs.STARTING_SPIN_DEGREES_PER_SECOND);
    let layoutDefs = $state.raw<Record<string, Record<string, number | boolean>>>({});

    const family = $derived(CorridorLayouts.SAMPLE_LAYOUTS[layoutKey].family);
    const knobs = $derived(CorridorLayoutKnobs.KNOBS_BY_FAMILY[family] as Record<string, Knob>);
    const defaults = $derived(CorridorLayoutDefaults.DEFAULTS_BY_FAMILY[family] as Record<string, unknown>);
    const defs = $derived(layoutDefs[layoutKey] ?? NO_DEFS);

    const toLayout = (spinDegrees: number) =>
        CorridorLayoutUtils.toLayoutRule({
            family,
            defs: { spinDegrees, ...defs },
        } as unknown as CorridorLayoutEntry);

    const items = $derived(Array.from({ length: itemCount }, (_, index) => toRoomName(index)));

    const commonProps: InfiniteCorridorExampleProps = $derived({
        items,
        glideDurationMs,
        spinDegreesPerSecond: family === "tube" ? spinDegreesPerSecond : 0,
        toLayout,
    });

    const examples: ExampleDefs[] = [
        {
            key: "scrolled",
            name: EXAMPLE_NAMES.scrolled,
            readout: () =>
                "scrolling the box walks the corridor one lap from top to bottom — Tab to a room out of view and the corridor brings it in, scrolling the box there",
            component: scrolledExample,
            path: `${EXAMPLES_ROOT}/Scrolled.svelte`,
        },
        {
            key: "clock",
            name: EXAMPLE_NAMES.clock,
            readout: () =>
                "the progress is advanced on every frame, so the corridor walks by itself until paused — it starts paused when the visitor has asked for reduced motion",
            component: clockExample,
            path: `${EXAMPLES_ROOT}/Clock.svelte`,
        },
    ];
</script>

{#snippet scrolledExample()}
    <ScrolledExampleWrapper {...commonProps} />
{/snippet}

{#snippet clockExample()}
    <ClockExampleWrapper {...commonProps} startingLapMs={InfiniteCorridorKnobs.STARTING_LAP_MS_BY_FAMILY[family]} />
{/snippet}

<PagePropsGroups>
    <PagePropsPanel scope={"sample"}>
        <PageProp
            itemKey={"layout"}
            controls={"Picks the sample layout sent to InfiniteCorridorProps.layout"}
            label={"Layout"}
            hint={
                "Where the items stand: walls is one row on each wall, from flat against it to turned towards the viewer, and tube lines the inside of a ring of sides, every item upright towards the center. Choosing one brings its own knobs with it."
            }
        >
            <PageSelectField
                value={layoutKey}
                values={CorridorLayouts.SAMPLE_KEYS}
                width={LAYOUT_FIELD_WIDTH}
                ariaLabel={"Layout"}
                onChange={(key) => {
                    layoutKey = key;
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

        {#if family === "tube"}
            <PageProp
                itemKey={"spinDegreesPerSecond"}
                controls={"Sets how fast the example turns the tube layout sent to InfiniteCorridorProps.layout"}
                label={"Rotation speed (°/s)"}
                hint={
                    "How fast the tube spins round its axis, whatever the corridor's position. The page turns the layout's spinDegrees on a clock; 0 stops it, and below 0 spins it the other way."
                }
            >
                <PageNumberField
                    value={spinDegreesPerSecond}
                    min={CorridorLayoutKnobs.MIN_SPIN_DEGREES_PER_SECOND}
                    max={CorridorLayoutKnobs.MAX_SPIN_DEGREES_PER_SECOND}
                    step={CorridorLayoutKnobs.SPIN_STEP_DEGREES_PER_SECOND}
                    width={FIELD_WIDTH}
                    ariaLabel={"Rotation speed in degrees per second"}
                    onInput={(value) => {
                        spinDegreesPerSecond = value;
                    }}
                />
            </PageProp>
        {/if}
    </PagePropsPanel>

    <PagePropsDivider />

    <PagePropsPanel scope={"global"}>
        <PageProp
            itemKey={"itemCount"}
            controls={"Sets the number of example rooms sent to InfiniteCorridorProps.items"}
            label={"Item count"}
            hint={
                "How many rooms line the corridor. Too few to fill it are repeated, and only the copy nearest the viewer can be reached."
            }
        >
            <PageNumberField
                value={itemCount}
                min={InfiniteCorridorKnobs.MIN_ITEM_COUNT}
                max={InfiniteCorridorKnobs.MAX_ITEM_COUNT}
                step={InfiniteCorridorKnobs.ITEM_COUNT_STEP}
                width={FIELD_WIDTH}
                ariaLabel={"Item count"}
                onInput={(value) => {
                    itemCount = value;
                }}
            />
        </PageProp>

        <PageProp
            itemKey={"glideDurationMs"}
            controls={"Sets InfiniteCorridorProps.glideDurationMs"}
            label={"Glide (ms)"}
            hint={
                "How long the corridor takes to bring a room into view when it is tabbed to from out of view. It times nothing else, so it shows only on Tab."
            }
        >
            <PageNumberField
                value={glideDurationMs}
                min={InfiniteCorridorKnobs.MIN_GLIDE_DURATION_MS}
                max={InfiniteCorridorKnobs.MAX_GLIDE_DURATION_MS}
                step={InfiniteCorridorKnobs.GLIDE_DURATION_STEP_MS}
                width={FIELD_WIDTH}
                ariaLabel={"Glide duration in milliseconds"}
                onInput={(value) => {
                    glideDurationMs = value;
                }}
            />
        </PageProp>
    </PagePropsPanel>
</PagePropsGroups>

<PageExamples items={examples} />
