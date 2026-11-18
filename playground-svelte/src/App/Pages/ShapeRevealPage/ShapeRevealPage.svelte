<script lang="ts">
    import { EXAMPLES_ONLY_PROP } from "@thewaver/ss-playground/App/PageComponents/Prop/Prop.const";
    import { SHAPE_REVEAL_DEFAULTS } from "@thewaver/ss-components-svelte";
    import { ShapeRevealKnobs } from "@thewaver/ss-playground/App/Knobs/ShapeReveals.const";
    import { THEME_OPTIONS } from "@thewaver/ss-playground/App/PageComponents/NavSettings/NavSettings.const";
    import {
        EXAMPLE_NAMES,
        EXAMPLES_ROOT,
        FIELD_WIDTH,
        SHAPE_FIELD_WIDTH,
    } from "@thewaver/ss-playground/App/Pages/ShapeRevealPage/ShapeRevealPage.const";
    import type { ShapeRevealShape } from "@thewaver/ss-playground/App/Pages/ShapeRevealPage/ShapeRevealPage.types";
    import { ShapeConst, type Size2d } from "@thewaver/ss-utils";

    import type { ExampleDefs } from "../../PageComponents/Examples/Examples.types";
    import PageExamples from "../../PageComponents/Examples/PageExamples.svelte";
    import PageNumberField from "../../PageComponents/Field/PageNumberField.svelte";
    import PageSelectField from "../../PageComponents/Field/PageSelectField.svelte";
    import PageProp from "../../PageComponents/Prop/Prop.svelte";
    import PagePropsPanel from "../../PageComponents/PropsPanel/PagePropsPanel.svelte";
    import { getAppliedTheme } from "../../PageComponents/Theme/ThemeSvelte.const.svelte";
    import ThemeCycleExample from "./Examples/ThemeCycle.svelte";
    import type { ShapeRevealExampleProps } from "./ShapeRevealExample.types";

    const computeThemeLabel = () =>
        THEME_OPTIONS.find((option) => option.value === getAppliedTheme())?.label ?? getAppliedTheme();

    let durationMs = $state(SHAPE_REVEAL_DEFAULTS.durationMs);
    let delayMs = $state(ShapeRevealKnobs.STARTING_DELAY_MS);
    let shape = $state<ShapeRevealShape>(ShapeRevealKnobs.STARTING_SHAPE);
    let softness = $state(SHAPE_REVEAL_DEFAULTS.softness);
    let startDegrees = $state(SHAPE_REVEAL_DEFAULTS.startDegrees);
    let endDegrees = $state(ShapeRevealKnobs.STARTING_END_DEGREES);

    const computePoints = $derived.by(() => {
        const current = shape;

        if (current === "circle") return undefined;

        return (size: Size2d) => ShapeConst.getDefaultShapePoints(current, size);
    });

    const commonProps: ShapeRevealExampleProps = $derived({
        durationMs,
        delayMs,
        computePoints,
        softness,
        startDegrees,
        endDegrees,
    });

    const examples: ExampleDefs[] = [
        {
            key: "themeCycle",
            name: EXAMPLE_NAMES.themeCycle,
            readout: () => `showing the ${computeThemeLabel()} theme`,
            component: themeCycleExample,
            path: `${EXAMPLES_ROOT}/ThemeCycle.svelte`,
        },
    ];
</script>

{#snippet themeCycleExample()}
    <ThemeCycleExample {...commonProps} />
{/snippet}

<PagePropsPanel scope={"global"}>
    <PageProp
        itemKey={"durationMs"}
        {...ShapeRevealKnobs.DURATION_MS_TEXT}
    >
        <PageNumberField
            value={durationMs}
            min={ShapeRevealKnobs.MIN_DURATION_MS}
            max={ShapeRevealKnobs.MAX_DURATION_MS}
            step={ShapeRevealKnobs.DURATION_STEP_MS}
            width={FIELD_WIDTH}
            ariaLabel={"Duration in milliseconds"}
            onInput={(value) => (durationMs = value)}
        />
    </PageProp>

    <PageProp
        itemKey={"delayMs"}
        controls={EXAMPLES_ONLY_PROP}
        label={"Delay (ms)"}
        hint={"How long the new theme stays on screen, once the circle has covered it, before the next."}
    >
        <PageNumberField
            value={delayMs}
            min={ShapeRevealKnobs.MIN_DELAY_MS}
            max={ShapeRevealKnobs.MAX_DELAY_MS}
            step={ShapeRevealKnobs.DELAY_STEP_MS}
            width={FIELD_WIDTH}
            ariaLabel={"Delay in milliseconds"}
            onInput={(value) => (delayMs = value)}
        />
    </PageProp>

    <PageProp
        itemKey={"computePoints"}
        {...ShapeRevealKnobs.COMPUTE_POINTS_TEXT}
    >
        <PageSelectField
            value={shape}
            values={ShapeRevealKnobs.SHAPES}
            width={SHAPE_FIELD_WIDTH}
            ariaLabel={"Shape"}
            onChange={(value) => (shape = value)}
        />
    </PageProp>

    <PageProp
        itemKey={"softness"}
        {...ShapeRevealKnobs.SOFTNESS_TEXT}
    >
        <PageNumberField
            value={softness}
            min={ShapeRevealKnobs.MIN_SOFTNESS}
            max={ShapeRevealKnobs.MAX_SOFTNESS}
            step={ShapeRevealKnobs.SOFTNESS_STEP}
            width={FIELD_WIDTH}
            ariaLabel={"Softness"}
            onInput={(value) => (softness = value)}
        />
    </PageProp>

    <PageProp
        itemKey={"startDegrees"}
        {...ShapeRevealKnobs.START_DEGREES_TEXT}
    >
        <PageNumberField
            value={startDegrees}
            min={ShapeRevealKnobs.MIN_DEGREES}
            max={ShapeRevealKnobs.MAX_DEGREES}
            step={ShapeRevealKnobs.DEGREES_STEP}
            width={FIELD_WIDTH}
            ariaLabel={"Start angle in degrees"}
            onInput={(value) => (startDegrees = value)}
        />
    </PageProp>

    <PageProp
        itemKey={"endDegrees"}
        {...ShapeRevealKnobs.END_DEGREES_TEXT}
    >
        <PageNumberField
            value={endDegrees}
            min={ShapeRevealKnobs.MIN_DEGREES}
            max={ShapeRevealKnobs.MAX_DEGREES}
            step={ShapeRevealKnobs.DEGREES_STEP}
            width={FIELD_WIDTH}
            ariaLabel={"End angle in degrees"}
            onInput={(value) => (endDegrees = value)}
        />
    </PageProp>
</PagePropsPanel>

<PageExamples items={examples} />
