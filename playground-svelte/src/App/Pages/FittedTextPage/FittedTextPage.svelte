<script lang="ts">
    import { FITTED_TEXT_DEFAULTS } from "@thewaver/ss-components-svelte";
    import { FittedTextKnobs } from "@thewaver/ss-playground/App/Knobs/FittedTexts.const";

    import type { ExampleDefs } from "../../PageComponents/Examples/Examples.types";
    import PageExamples from "../../PageComponents/Examples/PageExamples.svelte";
    import PageNumberField from "../../PageComponents/Field/PageNumberField.svelte";
    import PageProp from "../../PageComponents/Prop/Prop.svelte";
    import PagePropsPanel from "../../PageComponents/PropsPanel/PagePropsPanel.svelte";
    import PosterExample from "./Examples/Poster.svelte";
    import StackExample from "./Examples/Stack.svelte";

    const EXAMPLES_ROOT = "/src/App/Pages/FittedTextPage/Examples";

    const WIDE_SPAN = 2;

    let lineHeightRatio = $state(FITTED_TEXT_DEFAULTS.lineHeightRatio);

    const examples: ExampleDefs[] = [
        {
            key: "poster",
            name: "A poster",
            span: WIDE_SPAN,
            readout: () =>
                "every line is scaled to the full width, then the stack shrinks as one until it fits the height, so the shortest line comes out the largest; resize the window and it fits again",
            component: posterExample,
            path: `${EXAMPLES_ROOT}/Poster.svelte`,
        },
        {
            key: "stack",
            name: "A narrow box",
            readout: () =>
                "in a box this narrow the width runs out before the height does, so nothing has to shrink to fit and the lines keep their full-width sizes",
            component: stackExample,
            path: `${EXAMPLES_ROOT}/Stack.svelte`,
        },
    ];
</script>

{#snippet posterExample()}
    <PosterExample {lineHeightRatio} />
{/snippet}

{#snippet stackExample()}
    <StackExample {lineHeightRatio} />
{/snippet}

<PagePropsPanel scope={"global"}>
    <PageProp
        itemKey={"lineHeightRatio"}
        label={"Line height"}
        hint={"Each line's height as a multiple of its own font size, which is the room the stack is fitted with."}
    >
        <PageNumberField
            value={lineHeightRatio}
            min={FittedTextKnobs.MIN_LINE_HEIGHT_RATIO}
            max={FittedTextKnobs.MAX_LINE_HEIGHT_RATIO}
            step={FittedTextKnobs.LINE_HEIGHT_RATIO_STEP}
            ariaLabel={"Line height"}
            onInput={(value) => {
                lineHeightRatio = value;
            }}
        />
    </PageProp>
</PagePropsPanel>

<PageExamples items={examples} />
