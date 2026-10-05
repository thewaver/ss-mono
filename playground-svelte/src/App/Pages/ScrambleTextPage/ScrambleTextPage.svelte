<script lang="ts">
    import {
        MediaQueryMonitorSvelteUtils,
        SCRAMBLE_TEXT_DEFAULTS,
        ScrambleTextGlyphs,
        ScrambleTextWeights,
    } from "@thewaver/ss-components-svelte";
    import { ScrambleTextKnobs } from "@thewaver/ss-playground/App/Knobs/ScrambleTexts.const";

    import type { ExampleDefs } from "../../PageComponents/Examples/Examples.types";
    import PageExamples from "../../PageComponents/Examples/PageExamples.svelte";
    import PageNumberField from "../../PageComponents/Field/PageNumberField.svelte";
    import PageSelectField from "../../PageComponents/Field/PageSelectField.svelte";
    import PageProp from "../../PageComponents/Prop/Prop.svelte";
    import PagePropsPanel from "../../PageComponents/PropsPanel/PagePropsPanel.svelte";
    import ChangedOnlyExample from "./Examples/ChangedOnly.svelte";
    import HeadlineExample from "./Examples/Headline.svelte";
    import SequentialExample from "./Examples/Sequential.svelte";
    import SwapExample from "./Examples/Swap.svelte";
    import type { ScrambleTextExampleProps } from "./ScrambleTextPage.types";

    const EXAMPLES_ROOT = "/src/App/Pages/ScrambleTextPage/Examples";

    const NO_MOTION_DURATION_MS = 0;

    let settleDurationMs = $state(SCRAMBLE_TEXT_DEFAULTS.settleDurationMs);
    let scrambleIntervalMs = $state(SCRAMBLE_TEXT_DEFAULTS.scrambleIntervalMs);
    let glyphSet = $state<(typeof ScrambleTextKnobs.GLYPH_SETS)[number]>(ScrambleTextKnobs.STARTING_GLYPH_SET);
    let settleOrder = $state<(typeof ScrambleTextKnobs.SETTLE_ORDERS)[number]>(
        ScrambleTextKnobs.STARTING_SETTLE_ORDER,
    );

    const getPrefersReducedMotion = MediaQueryMonitorSvelteUtils.createReducedMotion();

    const commonProps: ScrambleTextExampleProps = $derived({
        settleDurationMs: getPrefersReducedMotion() ? NO_MOTION_DURATION_MS : settleDurationMs,
        scrambleIntervalMs,
        computeGlyphs: (character) =>
            glyphSet === "library"
                ? SCRAMBLE_TEXT_DEFAULTS.computeGlyphs()
                : ScrambleTextGlyphs.SAMPLE_GLYPHS[glyphSet](character),
        computeCharacterWeights: (count) =>
            settleOrder === "left_to_right" ? [] : ScrambleTextWeights.SAMPLE_WEIGHTS[settleOrder](count),
    });

    const examples: ExampleDefs[] = [
        {
            key: "headline",
            name: "Headline",
            readout: () => "a restart asked for mid-run throws away the run in progress and plays again from the start",
            component: headlineExample,
            path: `${EXAMPLES_ROOT}/Headline.svelte`,
        },
        {
            key: "sequential",
            name: "Sequential",
            readout: () =>
                "one character at a time, each churning inside its own window and landing before the next starts — which needs a run several times longer than a whole-line churn, or there is no time to see anything happen",
            component: sequentialExample,
            path: `${EXAMPLES_ROOT}/Sequential.svelte`,
        },
        {
            key: "swap",
            name: "Swap",
            readout: () => "nothing asks for a restart here — changing the text is what starts the run",
            component: swapExample,
            path: `${EXAMPLES_ROOT}/Swap.svelte`,
        },
        {
            key: "changedOnly",
            name: "Changed Only",
            readout: () =>
                "only what differs from the last text scrambles, and the characters an insertion pushes along stay put",
            component: changedOnlyExample,
            path: `${EXAMPLES_ROOT}/ChangedOnly.svelte`,
        },
    ];
</script>

{#snippet headlineExample()}
    <HeadlineExample {...commonProps} />
{/snippet}

{#snippet sequentialExample()}
    <SequentialExample {...commonProps} />
{/snippet}

{#snippet swapExample()}
    <SwapExample {...commonProps} />
{/snippet}

{#snippet changedOnlyExample()}
    <ChangedOnlyExample {...commonProps} />
{/snippet}

<PagePropsPanel scope={"global"}>
    <PageProp
        itemKey={"settleDurationMs"}
        label={"Settle duration (ms)"}
        hint={"How long the text takes to go from all scrambled to fully settled. It is off while the visitor has asked for reduced motion."}
    >
        <PageNumberField
            value={settleDurationMs}
            min={ScrambleTextKnobs.MIN_SETTLE_DURATION_MS}
            max={ScrambleTextKnobs.MAX_SETTLE_DURATION_MS}
            step={ScrambleTextKnobs.SETTLE_DURATION_STEP_MS}
            isDisabled={getPrefersReducedMotion()}
            ariaLabel={"Settle duration in milliseconds"}
            onInput={(value) => {
                settleDurationMs = value;
            }}
        />
    </PageProp>

    <PageProp
        itemKey={"scrambleIntervalMs"}
        label={"Scramble interval (ms)"}
        hint={"How often an unsettled character is swapped for another. Shorter intervals make a busier churn."}
    >
        <PageNumberField
            value={scrambleIntervalMs}
            min={ScrambleTextKnobs.MIN_SCRAMBLE_INTERVAL_MS}
            max={ScrambleTextKnobs.MAX_SCRAMBLE_INTERVAL_MS}
            step={ScrambleTextKnobs.SCRAMBLE_INTERVAL_STEP_MS}
            ariaLabel={"Scramble interval in milliseconds"}
            onInput={(value) => {
                scrambleIntervalMs = value;
            }}
        />
    </PageProp>

    <PageProp
        itemKey={"glyphSet"}
        label={"Glyphs"}
        hint={"Which characters the unsettled positions are drawn from. Matched churns a digit among digits and a letter among letters of its own case."}
    >
        <PageSelectField
            value={glyphSet}
            values={ScrambleTextKnobs.GLYPH_SETS}
            ariaLabel={"Glyphs"}
            onChange={(value) => {
                glyphSet = value;
            }}
        />
    </PageProp>

    <PageProp
        itemKey={"settleOrder"}
        label={"Settle order"}
        hint={"The order the characters settle in: left to right, from the middle out, at random, and so on."}
    >
        <PageSelectField
            value={settleOrder}
            values={ScrambleTextKnobs.SETTLE_ORDERS}
            ariaLabel={"Settle order"}
            onChange={(value) => {
                settleOrder = value;
            }}
        />
    </PageProp>
</PagePropsPanel>

<PageExamples items={examples} layout={"flow"} />
