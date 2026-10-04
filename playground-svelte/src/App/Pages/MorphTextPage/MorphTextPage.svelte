<script lang="ts">
    import { MORPH_TEXT_DEFAULTS, MediaQueryMonitorSvelteUtils } from "@thewaver/ss-components-svelte";
    import { MorphTextKnobs } from "@thewaver/ss-playground/App/Knobs/MorphTexts.const";

    import type { ExampleDefs } from "../../PageComponents/Examples/Examples.types";
    import PageExamples from "../../PageComponents/Examples/PageExamples.svelte";
    import PageNumberField from "../../PageComponents/Field/PageNumberField.svelte";
    import PageProp from "../../PageComponents/Prop/Prop.svelte";
    import PagePropsPanel from "../../PageComponents/PropsPanel/PagePropsPanel.svelte";
    import PaintedExample from "./Examples/Painted.svelte";
    import WordsExample from "./Examples/Words.svelte";

    const EXAMPLES_ROOT = "/src/App/Pages/MorphTextPage/Examples";

    const NO_MOTION_DURATION_MS = 0;

    let morphDurationMs = $state(MORPH_TEXT_DEFAULTS.morphDurationMs);
    let maxBlurPx = $state(MORPH_TEXT_DEFAULTS.maxBlurPx);
    let word = $state("");
    let paintedWord = $state("");

    const getPrefersReducedMotion = MediaQueryMonitorSvelteUtils.createReducedMotion();

    const commonProps = $derived({
        morphDurationMs: getPrefersReducedMotion() ? NO_MOTION_DURATION_MS : morphDurationMs,
        maxBlurPx,
    });

    const examples: ExampleDefs[] = [
        {
            key: "words",
            name: "Words in turn",
            readout: () =>
                `showing: ${word} — the page changes the word on a timer and the text melts into the next; Pause stops the cycle`,
            component: wordsExample,
            path: `${EXAMPLES_ROOT}/Words.svelte`,
        },
        {
            key: "painted",
            name: "Painted text",
            readout: () =>
                `showing: ${paintedWord} — each copy is a PaintedText with a moving gradient, and the melt still works because the filter sits on the morph's own box`,
            component: paintedExample,
            path: `${EXAMPLES_ROOT}/Painted.svelte`,
        },
    ];
</script>

{#snippet wordsExample()}
    <WordsExample
        {...commonProps}
        onWordChange={(next) => {
            word = next;
        }}
    />
{/snippet}

{#snippet paintedExample()}
    <PaintedExample
        {...commonProps}
        onWordChange={(next) => {
            paintedWord = next;
        }}
    />
{/snippet}

<PagePropsPanel scope={"global"}>
    <PageProp
        itemKey={"morphDurationMs"}
        label={"Morph duration (ms)"}
        hint={
            "How long one word takes to melt into the next. It is off while the visitor has asked for reduced motion."
        }
    >
        <PageNumberField
            value={morphDurationMs}
            min={MorphTextKnobs.MIN_MORPH_DURATION_MS}
            max={MorphTextKnobs.MAX_MORPH_DURATION_MS}
            step={MorphTextKnobs.MORPH_DURATION_STEP_MS}
            isDisabled={getPrefersReducedMotion()}
            ariaLabel={"Morph duration in milliseconds"}
            onInput={(value) => {
                morphDurationMs = value;
            }}
        />
    </PageProp>

    <PageProp
        itemKey={"maxBlurPx"}
        label={"Blur (px)"}
        hint={"The most either word is blurred while they cross. More blur melts more of the letters together."}
    >
        <PageNumberField
            value={maxBlurPx}
            min={MorphTextKnobs.MIN_MAX_BLUR_PX}
            max={MorphTextKnobs.MAX_MAX_BLUR_PX}
            step={MorphTextKnobs.MAX_BLUR_STEP_PX}
            ariaLabel={"Blur in pixels"}
            onInput={(value) => {
                maxBlurPx = value;
            }}
        />
    </PageProp>
</PagePropsPanel>

<PageExamples items={examples} />
