<script lang="ts">
    import {
        MediaQueryMonitorSvelteUtils,
        SHAPE_REVEAL_DEFAULTS,
        ShapeRevealUtils,
    } from "@thewaver/ss-components-svelte";
    import { ShapeRevealKnobs } from "@thewaver/ss-playground/App/Knobs/ShapeReveals.const";
    import {
        ORIGIN_LABELS,
        computeShapeRevealReadout,
    } from "@thewaver/ss-playground/App/Pages/ShapeRevealPage/ShapeRevealPage.const";
    import type {
        ShapeRevealPageOrigin,
        ShapeRevealPageShape,
        ShapeRevealRun,
    } from "@thewaver/ss-playground/App/Pages/ShapeRevealPage/ShapeRevealPage.types";

    import type { ExampleDefs } from "../../PageComponents/Examples/Examples.types";
    import PageExamples from "../../PageComponents/Examples/PageExamples.svelte";
    import PageNumberField from "../../PageComponents/Field/PageNumberField.svelte";
    import PageSelectField from "../../PageComponents/Field/PageSelectField.svelte";
    import PageProp from "../../PageComponents/Prop/Prop.svelte";
    import PagePropsPanel from "../../PageComponents/PropsPanel/PagePropsPanel.svelte";
    import SwitchExample from "./Examples/Switch.svelte";

    const EXAMPLES_ROOT = "/src/App/Pages/ShapeRevealPage/Examples";
    const FIELD_WIDTH = 110;
    const SELECT_FIELD_WIDTH = 190;

    const NO_MOTION_DURATION_MS = 0;

    let shape = $state<ShapeRevealPageShape>(ShapeRevealKnobs.STARTING_SHAPE);
    let origin = $state<ShapeRevealPageOrigin>(ShapeRevealKnobs.STARTING_ORIGIN);
    let durationMs = $state(SHAPE_REVEAL_DEFAULTS.durationMs);
    let blur = $state(SHAPE_REVEAL_DEFAULTS.blur);
    let run = $state<ShapeRevealRun>();

    const getPrefersReducedMotion = MediaQueryMonitorSvelteUtils.createReducedMotion();

    const examples: ExampleDefs[] = [
        {
            key: "switch",
            name: "A panel switched",
            readout: () => computeShapeRevealReadout(run, ShapeRevealUtils.getIsSupported()),
            component: switchExample,
            path: `${EXAMPLES_ROOT}/Switch.svelte`,
        },
    ];
</script>

{#snippet switchExample()}
    <SwitchExample
        {shape}
        {origin}
        durationMs={getPrefersReducedMotion() ? NO_MOTION_DURATION_MS : durationMs}
        {blur}
        onRun={(next) => {
            run = next;
        }}
    />
{/snippet}

<PagePropsPanel scope={"global"}>
    <PageProp
        itemKey={"computePoints"}
        label={"Shape"}
        hint={"The contour the new page is uncovered through. Every one grows until it covers the whole window."}
    >
        <PageSelectField
            value={shape}
            values={ShapeRevealKnobs.SHAPES}
            width={SELECT_FIELD_WIDTH}
            ariaLabel={"Shape"}
            onChange={(value) => (shape = value)}
        />
    </PageProp>

    <PageProp
        itemKey={"origin"}
        label={"Grows from"}
        hint={"Where the shape starts: the Switch button, the middle of the window, or one of its corners."}
    >
        <PageSelectField
            value={origin}
            values={ShapeRevealKnobs.ORIGINS}
            computeLabel={(value) => ORIGIN_LABELS[value]}
            width={SELECT_FIELD_WIDTH}
            ariaLabel={"Grows from"}
            onChange={(value) => (origin = value)}
        />
    </PageProp>

    <PageProp
        itemKey={"durationMs"}
        label={"Duration (ms)"}
        hint={"How long the shape takes to cover the window. It is off while the visitor has asked for reduced motion, and the panel then simply switches."}
    >
        <PageNumberField
            value={durationMs}
            min={ShapeRevealKnobs.MIN_DURATION_MS}
            max={ShapeRevealKnobs.MAX_DURATION_MS}
            step={ShapeRevealKnobs.DURATION_STEP_MS}
            width={FIELD_WIDTH}
            isDisabled={getPrefersReducedMotion()}
            ariaLabel={"Duration in milliseconds"}
            onInput={(value) => {
                durationMs = value;
            }}
        />
    </PageProp>

    <PageProp
        itemKey={"blur"}
        label={"Blur (px)"}
        hint={"How soft the shape's edge is by the time it covers the window. 0 gives a hard edge."}
    >
        <PageNumberField
            value={blur}
            min={ShapeRevealKnobs.MIN_BLUR}
            max={ShapeRevealKnobs.MAX_BLUR}
            step={ShapeRevealKnobs.BLUR_STEP}
            width={FIELD_WIDTH}
            ariaLabel={"Blur in pixels"}
            onInput={(value) => {
                blur = value;
            }}
        />
    </PageProp>
</PagePropsPanel>

<PageExamples items={examples} />
