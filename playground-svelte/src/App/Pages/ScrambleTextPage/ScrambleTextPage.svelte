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
    import type { ScrambleTextExampleProps } from "./ScrambleTextPageSvelte.types";
    import {
    EXAMPLE_NAMES,
    EXAMPLES_ROOT,
    NO_MOTION_DURATION_MS,
} from "@thewaver/ss-playground/App/Pages/ScrambleTextPage/ScrambleTextPage.const";

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
            name: EXAMPLE_NAMES.headline,
            readout: () => "a restart asked for mid-run throws away the run in progress and plays again from the start",
            component: headlineExample,
            path: `${EXAMPLES_ROOT}/Headline.svelte`,
        },
        {
            key: "sequential",
            name: EXAMPLE_NAMES.sequential,
            readout: () =>
                "one character at a time, each churning inside its own window and landing before the next starts — which needs a run several times longer than a whole-line churn, or there is no time to see anything happen",
            component: sequentialExample,
            path: `${EXAMPLES_ROOT}/Sequential.svelte`,
        },
        {
            key: "swap",
            name: EXAMPLE_NAMES.swap,
            readout: () => "nothing asks for a restart here — changing the text is what starts the run",
            component: swapExample,
            path: `${EXAMPLES_ROOT}/Swap.svelte`,
        },
        {
            key: "changedOnly",
            name: EXAMPLE_NAMES.changedOnly,
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
        {...ScrambleTextKnobs.SETTLE_DURATION_MS_TEXT}
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
        {...ScrambleTextKnobs.SCRAMBLE_INTERVAL_MS_TEXT}
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
        {...ScrambleTextKnobs.GLYPH_SET_TEXT}
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
        {...ScrambleTextKnobs.SETTLE_ORDER_TEXT}
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
