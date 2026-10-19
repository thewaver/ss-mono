<script lang="ts">
    import { CORNER_PIN_DEFAULTS } from "@thewaver/ss-components-svelte";
    import { CornerPinKnobs } from "@thewaver/ss-playground/App/Knobs/CornerPins.const";
    import {
        EXAMPLE_NAMES,
        EXAMPLES_ROOT,
        FIELD_WIDTH,
    } from "@thewaver/ss-playground/App/Pages/CornerPinPage/CornerPinPage.const";

    import type { ExampleDefs } from "../../PageComponents/Examples/Examples.types";
    import PageExamples from "../../PageComponents/Examples/PageExamples.svelte";
    import PageNumberField from "../../PageComponents/Field/PageNumberField.svelte";
    import PageProp from "../../PageComponents/Prop/Prop.svelte";
    import PagePropsPanel from "../../PageComponents/PropsPanel/PagePropsPanel.svelte";
    import type { CornerPinExampleProps } from "./CornerPinPageSvelte.types";
    import CardExample from "./Examples/Card.svelte";

    let reachRatio = $state(CORNER_PIN_DEFAULTS.reachRatio);

    const commonProps: CornerPinExampleProps = $derived({
        reachRatio,
    });

    const examples: ExampleDefs[] = [
        {
            key: "card",
            name: EXAMPLE_NAMES.card,
            readout: () =>
                "drag a grip, or tap one and then tap where it should go; Tab reaches each corner as two sliders, across and down, moved with the arrow keys",
            component: cardExample,
            path: `${EXAMPLES_ROOT}/Card.svelte`,
        },
    ];
</script>

{#snippet cardExample()}
    <CardExample {...commonProps} />
{/snippet}

<PagePropsPanel scope={"global"}>
    <PageProp
        itemKey={"reachRatio"}
        controls={"Sets CornerPinProps.reachRatio"}
        label={"Reach"}
        hint={"How far past each edge of the box a corner may be taken, as a share of the box. At 0 every corner stays on or inside the box, so the content can only be squeezed; above it, the content can be stretched beyond its own size too."}
    >
        <PageNumberField
            value={reachRatio}
            min={CornerPinKnobs.MIN_REACH_RATIO}
            max={CornerPinKnobs.MAX_REACH_RATIO}
            step={CornerPinKnobs.REACH_STEP_RATIO}
            width={FIELD_WIDTH}
            ariaLabel={"Reach as a share of the box"}
            onInput={(value) => {
                reachRatio = value;
            }}
        />
    </PageProp>
</PagePropsPanel>

<PageExamples items={examples} />
