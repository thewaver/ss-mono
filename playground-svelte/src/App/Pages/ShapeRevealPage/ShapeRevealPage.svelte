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
        controls={"Sets ShapeRevealOpts.durationMs"}
        label={"Duration (ms)"}
        hint={"How long the circle takes to grow over the whole window. 0 switches the theme at once, as does the system's reduced-motion setting."}
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
        controls={"Picks the example contour sent to ShapeRevealOpts.computePoints"}
        label={"Shape"}
        hint={"The contour that grows over the window. A circle is what the reveal draws when none is given."}
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
        controls={"Sets ShapeRevealOpts.softness"}
        label={"Softness"}
        hint={"How gradually the growing shape's edge fades, as a share of the distance it grows. 0 gives a hard edge."}
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
</PagePropsPanel>

<PageExamples items={examples} />
