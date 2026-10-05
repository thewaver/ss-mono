<script lang="ts">
    import { PROXIMITY_TEXT_DEFAULTS } from "@thewaver/ss-components-svelte";
    import { ProximityTextKnobs } from "@thewaver/ss-playground/App/Knobs/ProximityTexts.const";
    import { MEASURE_BOX_PADDING } from "@thewaver/ss-playground/App/PageComponents/MeasureBox/MeasureBox.css";

    import type { ExampleDefs } from "../../PageComponents/Examples/Examples.types";
    import PageExamples from "../../PageComponents/Examples/PageExamples.svelte";
    import PageCheckField from "../../PageComponents/Field/PageCheckField.svelte";
    import PageNumberField from "../../PageComponents/Field/PageNumberField.svelte";
    import PageMeasureBox from "../../PageComponents/MeasureBox/MeasureBox.svelte";
    import PageProp from "../../PageComponents/Prop/Prop.svelte";
    import PagePropsPanel from "../../PageComponents/PropsPanel/PagePropsPanel.svelte";
    import BarrelExample from "./Examples/Barrel.svelte";
    import PaintedExample from "./Examples/Painted.svelte";
    import PointerExample from "./Examples/Pointer.svelte";
    import WaveExample from "./Examples/Wave.svelte";
    import type { ProximityTextExampleProps } from "./ProximityTextPageSvelte.types";

    const EXAMPLES_ROOT = "/src/App/Pages/ProximityTextPage/Examples";
    const WIDE_SPAN = 2;

    let reachPx = $state(PROXIMITY_TEXT_DEFAULTS.reachPx);
    let isDisabled = $state(ProximityTextKnobs.STARTING_IS_DISABLED);

    const commonProps: ProximityTextExampleProps = $derived({ reachPx, isDisabled });

    const examples: ExampleDefs[] = [
        {
            key: "pointer",
            name: "Following the pointer",
            span: WIDE_SPAN,
            readout: () =>
                "each letter plays its keyframes held at how near the pointer is; the lines were wrapped for every letter at its heaviest, so the spare room sits at the end of each line while they rest",
            component: pointerExample,
            path: `${EXAMPLES_ROOT}/Pointer.svelte`,
        },
        {
            key: "wave",
            name: "A weight wave",
            span: WIDE_SPAN,
            readout: () =>
                "a point supplied in place of the pointer, moved across the line on a clock; Stop is the way to halt it that a motion running on its own owes the reader",
            component: waveExample,
            path: `${EXAMPLES_ROOT}/Wave.svelte`,
        },
        {
            key: "painted",
            name: "Painted",
            span: WIDE_SPAN,
            readout: () =>
                "PaintedText inside draws the letters; each grows and pushes the rest of its line along, as plain text does, while the line breaks stay put",
            component: paintedExample,
            path: `${EXAMPLES_ROOT}/Painted.svelte`,
        },
        {
            key: "barrel",
            name: "Inside a barrel",
            span: WIDE_SPAN,
            readout: () =>
                "a point fixed to the middle of the box and measured up and down only, so every letter on a line answers it alike: a line closes up as it reaches the middle and spreads apart again towards either edge, its keyframes running from spread to closed; the lines were wrapped with every letter at its widest, which here is the first frame, so no word jumps from one line to the next as they spread",
            component: barrelExample,
            path: `${EXAMPLES_ROOT}/Barrel.svelte`,
        },
    ];
</script>

{#snippet pointerExample()}
    <PageMeasureBox width={ProximityTextKnobs.BOX_WIDTH} padding={MEASURE_BOX_PADDING}>
        <PointerExample {...commonProps} />
    </PageMeasureBox>
{/snippet}

{#snippet waveExample()}
    <WaveExample {...commonProps} />
{/snippet}

{#snippet paintedExample()}
    <PageMeasureBox width={ProximityTextKnobs.BOX_WIDTH} padding={MEASURE_BOX_PADDING}>
        <PaintedExample {...commonProps} />
    </PageMeasureBox>
{/snippet}

{#snippet barrelExample()}
    <PageMeasureBox width={ProximityTextKnobs.BOX_WIDTH}>
        <BarrelExample {isDisabled} />
    </PageMeasureBox>
{/snippet}

<PagePropsPanel scope={"global"}>
    <PageProp
        itemKey={"reachPx"}
        label={"Reach (px)"}
        hint={"How far from a letter's middle the point still reaches it. Past it, the letter rests."}
    >
        <PageNumberField
            value={reachPx}
            min={ProximityTextKnobs.MIN_REACH_PX}
            max={ProximityTextKnobs.MAX_REACH_PX}
            step={ProximityTextKnobs.REACH_STEP_PX}
            ariaLabel={"Reach in pixels"}
            onInput={(value) => (reachPx = value)}
        />
    </PageProp>

    <PageProp
        itemKey={"isDisabled"}
        label={"Disabled"}
        hint={"Rests every letter and stops following the point. It is what a page honoring a reduced-motion preference passes."}
    >
        <PageCheckField value={isDisabled} ariaLabel={"Disabled"} onChange={(value) => (isDisabled = value)} />
    </PageProp>
</PagePropsPanel>

<PageExamples items={examples} />
