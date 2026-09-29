<script lang="ts">
    import { Button, SPLIT_PANE_DEFAULTS } from "@thewaver/ss-components-svelte";
    import { SplitPaneKnobs } from "@thewaver/ss-playground/App/Knobs/SplitPanes.const";

    import type { ExampleDefs } from "../../PageComponents/Examples/Examples.types";
    import PageExamples from "../../PageComponents/Examples/PageExamples.svelte";
    import PageCheckField from "../../PageComponents/Field/PageCheckField.svelte";
    import PageNumberField from "../../PageComponents/Field/PageNumberField.svelte";
    import PageProp from "../../PageComponents/Prop/Prop.svelte";
    import PagePropsPanel from "../../PageComponents/PropsPanel/PagePropsPanel.svelte";
    import PageButtonContent from "../../StyledComponents/ButtonContent/ButtonContent.svelte";
    import BoundedExample from "./Examples/Bounded.svelte";
    import CompareExample from "./Examples/Compare.svelte";
    import CrampedExample from "./Examples/Cramped.svelte";
    import PairExample from "./Examples/Pair.svelte";
    import RightToLeftExample from "./Examples/RightToLeft.svelte";
    import StackedExample from "./Examples/Stacked.svelte";
    import TripleExample from "./Examples/Triple.svelte";
    import type { SplitPaneExampleProps } from "./SplitPanePage.types";

    const GUTTER_FIELD_WIDTH = 90;
    const PERCENT = 100;
    const EXAMPLES_ROOT = "/src/App/Pages/SplitPanePage/Examples";

    const STARTING_PAIR = [0.3, 0.7];
    const STARTING_RIGHT_TO_LEFT = [0.3, 0.7];
    const STARTING_BOUNDED = [0.3, 0.7];
    const STARTING_CRAMPED = [0.5, 0.5];
    const STARTING_TRIPLE = [0.25, 0.5, 0.25];
    const STARTING_COLUMN = [0.4, 0.6];
    const STARTING_COMPARE = [0.5, 0.5];

    const percent = (ratios: number[]) => ratios.map((ratio) => `${Math.round(ratio * PERCENT)}%`).join(" / ");

    let gutterSize = $state(SPLIT_PANE_DEFAULTS.gutterSize);
    let isDisabled = $state(SplitPaneKnobs.STARTING_IS_DISABLED);

    let pairRatios = $state.raw(STARTING_PAIR);
    let rightToLeftRatios = $state.raw(STARTING_RIGHT_TO_LEFT);
    let boundedRatios = $state.raw(STARTING_BOUNDED);
    let crampedRatios = $state.raw(STARTING_CRAMPED);
    let tripleRatios = $state.raw(STARTING_TRIPLE);
    let columnRatios = $state.raw(STARTING_COLUMN);
    let compareRatios = $state.raw(STARTING_COMPARE);

    const reset = () => {
        pairRatios = STARTING_PAIR;
        rightToLeftRatios = STARTING_RIGHT_TO_LEFT;
        boundedRatios = STARTING_BOUNDED;
        crampedRatios = STARTING_CRAMPED;
        tripleRatios = STARTING_TRIPLE;
        columnRatios = STARTING_COLUMN;
        compareRatios = STARTING_COMPARE;
    };

    const commonProps: Omit<SplitPaneExampleProps, "ratios"> = $derived({
        gutterSize,
        isDisabled,
    });

    const examples: ExampleDefs[] = [
        {
            key: "pair",
            name: "Two panes",
            readout: () => `ratios: ${percent(pairRatios)} — drag the gutter or arrow it with the keyboard`,
            component: pairExample,
            path: `${EXAMPLES_ROOT}/Pair.svelte`,
        },
        {
            key: "rightToLeft",
            name: "In a right-to-left box",
            readout: () =>
                `ratios: ${percent(rightToLeftRatios)} — the box around the panes sets dir="rtl", so the first pane sits on the right and the gutter follows the pointer and the arrow keys from that side`,
            component: rightToLeftExample,
            path: `${EXAMPLES_ROOT}/RightToLeft.svelte`,
        },
        {
            key: "bounded",
            name: "Bounded panes",
            readout: () =>
                `ratios: ${percent(boundedRatios)} — the first pane is held between 120px and 220px whatever the ratio says`,
            component: boundedExample,
            path: `${EXAMPLES_ROOT}/Bounded.svelte`,
        },
        {
            key: "triple",
            name: "Three panes",
            readout: () => `ratios: ${percent(tripleRatios)} — a gutter moves its two neighbors and nothing else`,
            component: tripleExample,
            path: `${EXAMPLES_ROOT}/Triple.svelte`,
        },
        {
            key: "stacked",
            name: "Stacked",
            readout: () => `ratios: ${percent(columnRatios)} — the same control on the other axis`,
            component: stackedExample,
            path: `${EXAMPLES_ROOT}/Stacked.svelte`,
        },
        {
            key: "compare",
            name: "Two pictures",
            readout: () =>
                `ratios: ${percent(compareRatios)} — both pictures are drawn at the full width of the frame, so the gutter wipes between them instead of squeezing them`,
            component: compareExample,
            path: `${EXAMPLES_ROOT}/Compare.svelte`,
        },
        {
            key: "cramped",
            name: "Minimums that do not fit",
            readout: () =>
                `minimums of 250px and 400px in a box too narrow for both — grid honors the floors and lets the row overflow, which is the behavior this control inherits rather than fights`,
            component: crampedExample,
            path: `${EXAMPLES_ROOT}/Cramped.svelte`,
        },
    ];
</script>

{#snippet pairExample()}
    <PairExample {...commonProps} bind:ratios={pairRatios} />
{/snippet}

{#snippet rightToLeftExample()}
    <RightToLeftExample {...commonProps} bind:ratios={rightToLeftRatios} />
{/snippet}

{#snippet boundedExample()}
    <BoundedExample {...commonProps} bind:ratios={boundedRatios} />
{/snippet}

{#snippet tripleExample()}
    <TripleExample {...commonProps} bind:ratios={tripleRatios} />
{/snippet}

{#snippet stackedExample()}
    <StackedExample {...commonProps} bind:ratios={columnRatios} />
{/snippet}

{#snippet compareExample()}
    <CompareExample {...commonProps} bind:ratios={compareRatios} />
{/snippet}

{#snippet crampedExample()}
    <CrampedExample {...commonProps} bind:ratios={crampedRatios} />
{/snippet}

<PagePropsPanel scope={"global"}>
    <PageProp
        itemKey={"gutterSize"}
        label={"Gutter size (px)"}
        hint={"How wide the draggable divider between two panes is."}
    >
        <PageNumberField
            value={gutterSize}
            min={SplitPaneKnobs.MIN_GUTTER}
            max={SplitPaneKnobs.MAX_GUTTER}
            step={SplitPaneKnobs.GUTTER_STEP}
            width={GUTTER_FIELD_WIDTH}
            ariaLabel={"Gutter size in pixels"}
            onInput={(value) => {
                gutterSize = value;
            }}
        />
    </PageProp>

    <PageProp
        itemKey={"isDisabled"}
        label={"Disabled"}
        hint={"Turns the dividers off, so the panes keep the sizes they have."}
    >
        <PageCheckField
            value={isDisabled}
            ariaLabel={"Disabled"}
            onChange={(value) => {
                isDisabled = value;
            }}
        />
    </PageProp>

    <PageProp itemKey={"ratios"} label={"Ratios"} hint={"Puts the panes back to the sizes they started at."}>
        <Button
            onClick={async () => {
                reset();
            }}
        >
            {#snippet renderContent(flags)}
                <PageButtonContent {flags}>Reset</PageButtonContent>
            {/snippet}
        </Button>
    </PageProp>
</PagePropsPanel>

<PageExamples items={examples} minColumnWidth={400} />
