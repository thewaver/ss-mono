<script lang="ts">
    import { RGB_SPLITTER_DEFAULTS } from "@thewaver/ss-components-svelte";
    import { RGBSplitterKnobs } from "@thewaver/ss-playground/App/Knobs/RGBSplitters.const";
    import {
        BOX_HEIGHT,
        EXAMPLE_NAMES,
        EXAMPLES_ROOT,
        FIELD_WIDTH,
    } from "@thewaver/ss-playground/App/Pages/PointerEffects/RGBSplitterPage/RGBSplitterPage.const";

    import type { ExampleDefs } from "../../../PageComponents/Examples/Examples.types";
    import PageExamples from "../../../PageComponents/Examples/PageExamples.svelte";
    import PageCheckField from "../../../PageComponents/Field/PageCheckField.svelte";
    import PageNumberField from "../../../PageComponents/Field/PageNumberField.svelte";
    import PageSelectField from "../../../PageComponents/Field/PageSelectField.svelte";
    import PageMeasureBox from "../../../PageComponents/MeasureBox/MeasureBox.svelte";
    import PageProp from "../../../PageComponents/Prop/Prop.svelte";
    import PagePropsPanel from "../../../PageComponents/PropsPanel/PagePropsPanel.svelte";
    import HeadlineExample from "./Examples/Headline.svelte";
    import PhotoExample from "./Examples/Photo.svelte";
    import type { RGBSplitterExampleProps } from "./RGBSplitterPageSvelte.types";

    let isDisabled = $state(RGBSplitterKnobs.STARTING_IS_DISABLED);
    let smoothingMs = $state(RGB_SPLITTER_DEFAULTS.smoothingMs);
    let activeRangePx = $state(RGBSplitterKnobs.STARTING_ACTIVE_RANGE_PX);
    let splitRangePx = $state(RGB_SPLITTER_DEFAULTS.splitRangePx);
    let maxOffsetPx = $state(RGB_SPLITTER_DEFAULTS.maxOffsetPx);
    let colorMixingChoice = $state<(typeof RGBSplitterKnobs.COLOR_MIXING_CHOICES)[number]>(
        RGBSplitterKnobs.FROM_COLOR_SCHEME,
    );

    const colorMixing = $derived(
        colorMixingChoice === RGBSplitterKnobs.FROM_COLOR_SCHEME ? undefined : colorMixingChoice,
    );

    const commonProps: RGBSplitterExampleProps = $derived({
        isDisabled,
        activeRangePx,
        smoothingMs,
        splitRangePx,
        maxOffsetPx,
        colorMixing,
    });

    const examples: ExampleDefs[] = [
        {
            key: "photo",
            name: EXAMPLE_NAMES.photo,
            readout: () =>
                "the channels pull apart as the pointer heads for the middle — leave and come back, and each takes a new direction",
            component: photoExample,
            path: `${EXAMPLES_ROOT}/Photo.svelte`,
        },
        {
            key: "headline",
            name: EXAMPLE_NAMES.headline,
            readout: () => "type on a transparent ground, so the fringes fall straight onto the page",
            component: headlineExample,
            path: `${EXAMPLES_ROOT}/Headline.svelte`,
        },
    ];
</script>

{#snippet photoExample()}
    <PageMeasureBox isFilling height={BOX_HEIGHT}>
        <PhotoExample {...commonProps} />
    </PageMeasureBox>
{/snippet}

{#snippet headlineExample()}
    <PageMeasureBox isFilling height={BOX_HEIGHT}>
        <HeadlineExample {...commonProps} />
    </PageMeasureBox>
{/snippet}

<PagePropsPanel scope={"global"}>
    <PageProp
        itemKey={"isDisabled"}
        label={"Disabled"}
        hint={"Stops the content answering the pointer and leaves it whole. It is what a page honoring a reduced-motion preference passes."}
    >
        <PageCheckField value={isDisabled} ariaLabel={"Disabled"} onChange={(value) => (isDisabled = value)} />
    </PageProp>

    <PageProp
        itemKey={"smoothingMs"}
        label={"Smoothing (ms)"}
        hint={"How long the split takes to catch up with the pointer. At 0 it follows exactly; raised, the channels glide apart and back together."}
    >
        <PageNumberField
            value={smoothingMs}
            min={RGBSplitterKnobs.MIN_SMOOTHING_MS}
            max={RGBSplitterKnobs.MAX_SMOOTHING_MS}
            step={RGBSplitterKnobs.SMOOTHING_STEP_MS}
            width={FIELD_WIDTH}
            ariaLabel={"Smoothing in milliseconds"}
            onInput={(value) => (smoothingMs = value)}
        />
    </PageProp>

    <PageProp
        itemKey={"activeRangePx"}
        label={"Active range (px)"}
        hint={"How near the pointer has to be before the content answers it at all, measured from its center. Outside it the content stays whole."}
    >
        <PageNumberField
            value={activeRangePx}
            min={RGBSplitterKnobs.MIN_ACTIVE_RANGE_PX}
            max={RGBSplitterKnobs.MAX_ACTIVE_RANGE_PX}
            step={RGBSplitterKnobs.ACTIVE_RANGE_STEP_PX}
            width={FIELD_WIDTH}
            ariaLabel={"Active range in pixels"}
            onInput={(value) => (activeRangePx = value)}
        />
    </PageProp>

    <PageProp
        itemKey={"splitRangePx"}
        label={"Split range (px)"}
        hint={"How far the split reaches. Widest with the pointer on the center, closed out here."}
    >
        <PageNumberField
            value={splitRangePx}
            min={RGBSplitterKnobs.MIN_SPLIT_RANGE_PX}
            max={RGBSplitterKnobs.MAX_SPLIT_RANGE_PX}
            step={RGBSplitterKnobs.SPLIT_RANGE_STEP_PX}
            width={FIELD_WIDTH}
            ariaLabel={"Split range in pixels"}
            onInput={(value) => (splitRangePx = value)}
        />
    </PageProp>

    <PageProp
        itemKey={"maxOffsetPx"}
        label={"Max offset (px)"}
        hint={"The furthest any one channel is shifted, with the pointer on the center. Each channel picks a random direction and distance within it every time the split opens."}
    >
        <PageNumberField
            value={maxOffsetPx}
            min={RGBSplitterKnobs.MIN_OFFSET_PX}
            max={RGBSplitterKnobs.MAX_OFFSET_PX}
            step={RGBSplitterKnobs.OFFSET_STEP_PX}
            width={FIELD_WIDTH}
            ariaLabel={"Maximum offset in pixels"}
            onInput={(value) => (maxOffsetPx = value)}
        />
    </PageProp>

    <PageProp
        itemKey={"colorMixing"}
        label={"Color mixing"}
        hint={"How the channels are put back together. Additive fringes are red, green and blue and read on a dark ground; subtractive ones are cyan, magenta and yellow and read on a light one. Left out, it follows the page's color-scheme each time the split opens."}
    >
        <PageSelectField
            value={colorMixingChoice}
            values={RGBSplitterKnobs.COLOR_MIXING_CHOICES}
            ariaLabel={"Color mixing"}
            onChange={(value) => (colorMixingChoice = value)}
        />
    </PageProp>
</PagePropsPanel>

<PageExamples items={examples} />
