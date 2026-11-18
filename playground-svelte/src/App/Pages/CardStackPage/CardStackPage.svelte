<script lang="ts">
    import { CARD_STACK_DEFAULTS, CARD_STACK_PILE_SIDES } from "@thewaver/ss-components-svelte";
    import { CardStackKnobs } from "@thewaver/ss-playground/App/Knobs/CardStacks.const";
    import type { SwipeDirection } from "@thewaver/ss-utils";

    import type { ExampleDefs } from "../../PageComponents/Examples/Examples.types";
    import PageExamples from "../../PageComponents/Examples/PageExamples.svelte";
    import PageCheckField from "../../PageComponents/Field/PageCheckField.svelte";
    import PageNumberField from "../../PageComponents/Field/PageNumberField.svelte";
    import PageSelectField from "../../PageComponents/Field/PageSelectField.svelte";
    import PageProp from "../../PageComponents/Prop/Prop.svelte";
    import PagePropsPanel from "../../PageComponents/PropsPanel/PagePropsPanel.svelte";
    import DeckExample from "./Examples/Deck.svelte";
    import EndlessExample from "./Examples/Endless.svelte";
    import {
    EXAMPLE_NAMES,
    EXAMPLES_ROOT,
    FIELD_WIDTH,
} from "@thewaver/ss-playground/App/Pages/CardStackPage/CardStackPage.const";

    let isDisabled = $state(CardStackKnobs.STARTING_IS_DISABLED);
    let commitRatio = $state(CARD_STACK_DEFAULTS.commitRatio);
    let transitionDurationMs = $state(CARD_STACK_DEFAULTS.transitionDurationMs);
    let mountedCount = $state(CARD_STACK_DEFAULTS.mountedCount);
    let cardGap = $state(CARD_STACK_DEFAULTS.cardGap);
    let funnelRatio = $state(CARD_STACK_DEFAULTS.funnelRatio);
    let pileSide = $state(CARD_STACK_DEFAULTS.pileSide);

    let lastSend = $state.raw<{ direction: SwipeDirection; card: string }>();
    let isEmpty = $state(false);

    let lastEndlessSend = $state.raw<{ direction: SwipeDirection; card: string }>();
    let loadedCount = $state(0);

    const examples: ExampleDefs[] = [
        {
            key: "deck",
            name: EXAMPLE_NAMES.deck,
            readout: () => {
                if (isEmpty) return "the pile is empty — deal again to put every card back";

                if (!lastSend) return "push the top card any of the four ways, or use the buttons or the arrow keys";

                return `${lastSend.card} went ${lastSend.direction}`;
            },
            component: deckExample,
            path: `${EXAMPLES_ROOT}/Deck.svelte`,
        },
        {
            key: "endless",
            name: EXAMPLE_NAMES.endless,
            readout: () => {
                if (!lastEndlessSend)
                    return "left or right only — an upward push springs back, and on a touch screen it scrolls the page instead";

                return `${lastEndlessSend.card} went ${lastEndlessSend.direction} — ${loadedCount} cards loaded so far, more arrive as the pile runs low`;
            },
            component: endlessExample,
            path: `${EXAMPLES_ROOT}/Endless.svelte`,
        },
    ];
</script>

{#snippet deckExample()}
    <DeckExample
        {isDisabled}
        {commitRatio}
        {transitionDurationMs}
        {mountedCount}
        {cardGap}
        {funnelRatio}
        {pileSide}
        onSend={(direction, card) => {
            lastSend = { direction, card };
        }}
        onEmpty={() => {
            isEmpty = true;
        }}
        onDeal={() => {
            isEmpty = false;
            lastSend = undefined;
        }}
        onRecall={() => {
            isEmpty = false;
        }}
    />
{/snippet}

{#snippet endlessExample()}
    <EndlessExample
        {isDisabled}
        {commitRatio}
        {transitionDurationMs}
        {mountedCount}
        {cardGap}
        {funnelRatio}
        {pileSide}
        onSend={(direction, card) => {
            lastEndlessSend = { direction, card };
        }}
        onLoad={(count) => {
            loadedCount = count;
        }}
    />
{/snippet}

<PagePropsPanel scope={"global"}>
    <PageProp
        itemKey={"isDisabled"}
        {...CardStackKnobs.IS_DISABLED_TEXT}
    >
        <PageCheckField
            value={isDisabled}
            ariaLabel={"Disabled"}
            onChange={(value) => {
                isDisabled = value;
            }}
        />
    </PageProp>

    <PageProp
        itemKey={"commitRatio"}
        {...CardStackKnobs.COMMIT_RATIO_TEXT}
    >
        <PageNumberField
            value={commitRatio}
            min={CardStackKnobs.MIN_COMMIT_RATIO}
            max={CardStackKnobs.MAX_COMMIT_RATIO}
            step={CardStackKnobs.COMMIT_RATIO_STEP}
            width={FIELD_WIDTH}
            ariaLabel={"Commit ratio"}
            onInput={(value) => {
                commitRatio = value;
            }}
        />
    </PageProp>

    <PageProp
        itemKey={"transitionDurationMs"}
        {...CardStackKnobs.TRANSITION_DURATION_MS_TEXT}
    >
        <PageNumberField
            value={transitionDurationMs}
            min={CardStackKnobs.MIN_DURATION_MS}
            max={CardStackKnobs.MAX_DURATION_MS}
            step={CardStackKnobs.DURATION_STEP_MS}
            width={FIELD_WIDTH}
            ariaLabel={"Duration in milliseconds"}
            onInput={(value) => {
                transitionDurationMs = value;
            }}
        />
    </PageProp>

    <PageProp
        itemKey={"mountedCount"}
        {...CardStackKnobs.MOUNTED_COUNT_TEXT}
    >
        <PageNumberField
            value={mountedCount}
            min={CardStackKnobs.MIN_MOUNTED_COUNT}
            max={CardStackKnobs.MAX_MOUNTED_COUNT}
            step={CardStackKnobs.MOUNTED_COUNT_STEP}
            width={FIELD_WIDTH}
            ariaLabel={"Mounted cards"}
            onInput={(value) => {
                mountedCount = value;
            }}
        />
    </PageProp>

    <PageProp
        itemKey={"cardGap"}
        {...CardStackKnobs.CARD_GAP_TEXT}
    >
        <PageNumberField
            value={cardGap}
            min={CardStackKnobs.MIN_CARD_GAP}
            max={CardStackKnobs.MAX_CARD_GAP}
            step={CardStackKnobs.CARD_GAP_STEP}
            width={FIELD_WIDTH}
            ariaLabel={"Card gap in pixels"}
            onInput={(value) => {
                cardGap = value;
            }}
        />
    </PageProp>

    <PageProp
        itemKey={"funnelRatio"}
        {...CardStackKnobs.FUNNEL_RATIO_TEXT}
    >
        <PageNumberField
            value={funnelRatio}
            min={CardStackKnobs.MIN_FUNNEL_RATIO}
            max={CardStackKnobs.MAX_FUNNEL_RATIO}
            step={CardStackKnobs.FUNNEL_RATIO_STEP}
            width={FIELD_WIDTH}
            ariaLabel={"Funnel"}
            onInput={(value) => {
                funnelRatio = value;
            }}
        />
    </PageProp>

    <PageProp
        itemKey={"pileSide"}
        {...CardStackKnobs.PILE_SIDE_TEXT}
    >
        <PageSelectField
            value={pileSide}
            values={CARD_STACK_PILE_SIDES}
            ariaLabel={"Pile side"}
            onChange={(next) => {
                pileSide = next;
            }}
        />
    </PageProp>
</PagePropsPanel>

<PageExamples items={examples} />
