<script lang="ts">
    import type { CuboidController } from "@thewaver/ss-components-svelte";
    import { CUBOID_DEFAULTS, CuboidUtils, MediaQueryMonitorSvelteUtils } from "@thewaver/ss-components-svelte";
    import { CuboidKnobs } from "@thewaver/ss-playground/App/Knobs/Cuboids.const";

    import type { ExampleDefs } from "../../PageComponents/Examples/Examples.types";
    import PageExamples from "../../PageComponents/Examples/PageExamples.svelte";
    import PageNumberField from "../../PageComponents/Field/PageNumberField.svelte";
    import PageProp from "../../PageComponents/Prop/Prop.svelte";
    import PagePropsPanel from "../../PageComponents/PropsPanel/PagePropsPanel.svelte";
    import DefaultExample from "./Examples/Default.svelte";
    import UprightExampleWrapper from "./UprightExampleWrapper.svelte";
    import WanderingExampleWrapper from "./WanderingExampleWrapper.svelte";

    const NO_MOTION_DURATION_MS = 0;

    const FIELD_WIDTH = 110;
    const EXAMPLES_ROOT = "/src/App/Pages/CuboidPage/Examples";

    let width = $state(CuboidKnobs.STARTING_WIDTH);
    let height = $state(CuboidKnobs.STARTING_HEIGHT);
    let depth = $state(CuboidKnobs.STARTING_DEPTH);
    let transitionDurationMs = $state(CUBOID_DEFAULTS.transitionDurationMs);

    let yaw = $state(0);
    let pitch = $state(0);
    let wanderingYaw = $state(0);
    let wanderingPitch = $state(0);
    let uprightYaw = $state(0);
    let uprightPitch = $state(0);
    let uprightController = $state.raw<CuboidController>();

    const uprightFacing = $derived(uprightController?.getFacing());

    const getPrefersReducedMotion = MediaQueryMonitorSvelteUtils.createReducedMotion();

    const prefersReducedMotion = $derived(getPrefersReducedMotion());

    const turnDurationMs = $derived(prefersReducedMotion ? NO_MOTION_DURATION_MS : transitionDurationMs);

    const size = $derived({ width, height, depth });

    const examples: ExampleDefs[] = [
        {
            key: "default",
            name: "Six faces, two turns",
            readout: () =>
                `${CuboidUtils.getFacingFromTurns(yaw, pitch)} — across ${yaw}, up ${pitch}; the two counts are quarter turns rather than a face, so the box always takes the way it was pushed`,
            component: defaultExample,
            path: `${EXAMPLES_ROOT}/Default.svelte`,
        },
        {
            key: "wandering",
            name: "Turning to a neighbor on its own",
            readout: () =>
                `${CuboidUtils.getFacingFromTurns(wanderingYaw, wanderingPitch)} — every tick takes one quarter turn at random, discarding the ones that would leave the same face in view or turn back to the face it just left, so the box only ever moves on to a new face sharing an edge with this one`,
            component: wanderingExample,
            path: `${EXAMPLES_ROOT}/Wandering.svelte`,
        },
        {
            key: "upright",
            name: "Upright, by name, and by hand",
            readout: () =>
                `${uprightFacing ?? "front"} — across ${uprightYaw}, up ${uprightPitch}; the counts only record the presses here, so the box keeps its own orientation and the face names ask it for the shortest way round`,
            component: uprightExample,
            path: `${EXAMPLES_ROOT}/Upright.svelte`,
        },
    ];
</script>

{#snippet defaultExample()}
    <DefaultExample bind:yaw bind:pitch {size} transitionDurationMs={turnDurationMs} />
{/snippet}

{#snippet wanderingExample()}
    <WanderingExampleWrapper
        bind:yaw={wanderingYaw}
        bind:pitch={wanderingPitch}
        {size}
        transitionDurationMs={turnDurationMs}
    />
{/snippet}

{#snippet uprightExample()}
    <UprightExampleWrapper
        bind:yaw={uprightYaw}
        bind:pitch={uprightPitch}
        bind:controller={uprightController}
        {size}
        transitionDurationMs={turnDurationMs}
    />
{/snippet}

<PagePropsPanel scope={"global"}>
    <PageProp itemKey={"width"} label={"Width (px)"} hint={"How wide the box is."}>
        <PageNumberField
            value={width}
            min={CuboidKnobs.MIN_EXTENT}
            max={CuboidKnobs.MAX_EXTENT}
            step={CuboidKnobs.EXTENT_STEP}
            width={FIELD_WIDTH}
            ariaLabel={"Width in pixels"}
            onInput={(value) => {
                width = value;
            }}
        />
    </PageProp>

    <PageProp itemKey={"height"} label={"Height (px)"} hint={"How tall the box is."}>
        <PageNumberField
            value={height}
            min={CuboidKnobs.MIN_EXTENT}
            max={CuboidKnobs.MAX_EXTENT}
            step={CuboidKnobs.EXTENT_STEP}
            width={FIELD_WIDTH}
            ariaLabel={"Height in pixels"}
            onInput={(value) => {
                height = value;
            }}
        />
    </PageProp>

    <PageProp itemKey={"depth"} label={"Depth (px)"} hint={"How deep the box is, front face to back face."}>
        <PageNumberField
            value={depth}
            min={CuboidKnobs.MIN_EXTENT}
            max={CuboidKnobs.MAX_EXTENT}
            step={CuboidKnobs.EXTENT_STEP}
            width={FIELD_WIDTH}
            ariaLabel={"Depth in pixels"}
            onInput={(value) => {
                depth = value;
            }}
        />
    </PageProp>

    <PageProp
        itemKey={"transitionDurationMs"}
        label={"Turn duration (ms)"}
        hint={
            "How long one turn from face to face takes, and how long the box takes to settle after a drag. It is off while the visitor has asked for reduced motion."
        }
    >
        <PageNumberField
            value={transitionDurationMs}
            min={CuboidKnobs.MIN_DURATION_MS}
            max={CuboidKnobs.MAX_DURATION_MS}
            step={CuboidKnobs.DURATION_STEP_MS}
            width={FIELD_WIDTH}
            isDisabled={prefersReducedMotion}
            ariaLabel={"Turn duration in milliseconds"}
            onInput={(value) => {
                transitionDurationMs = value;
            }}
        />
    </PageProp>
</PagePropsPanel>

<PageExamples items={examples} />
