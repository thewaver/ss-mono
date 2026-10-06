<script lang="ts">
    import { Button, CardStack } from "@thewaver/ss-components-svelte";
    import type { CardStackControls } from "@thewaver/ss-components-svelte";
    import { computeCardTilt } from "@thewaver/ss-playground/App/Pages/CardStackPage/CardStackPage.const";
    import * as styles from "@thewaver/ss-playground/App/Pages/CardStackPage/CardStackPage.css";
    import type { SwipeDirection } from "@thewaver/ss-utils";
    import { CONTROL_GLYPHS } from "@thewaver/ss-playground/App/StyledComponents/ControlButtonContent/ControlButtonContent.const";

    import PageMeasureBox from "../../../PageComponents/MeasureBox/MeasureBox.svelte";
    import PageControlButtonContent from "../../../StyledComponents/ControlButtonContent/ControlButtonContent.svelte";
    import type { CardStackDeckExampleProps } from "../CardStackExamples.types";

    const CARDS = [
        "Ace",
        "King",
        "Queen",
        "Jack",
        "Ten",
        "Nine",
        "Eight",
        "Seven",
        "Six",
        "Five",
        "Four",
        "Three",
        "Two",
    ];
    const DIRECTIONS: SwipeDirection[] = ["left", "right", "up", "down"];
    const DIRECTION_GLYPHS: Record<SwipeDirection, string> = {
        left: CONTROL_GLYPHS.left,
        right: CONTROL_GLYPHS.right,
        up: CONTROL_GLYPHS.up,
        down: CONTROL_GLYPHS.down,
    };

    const BOX_HEIGHT = 240;

    const SHOWN = 1;
    const FIRST_INDEX = 0;
    const GONE = 0;

    type Props = CardStackDeckExampleProps;

    let props: Props = $props();

    let controls = $state.raw<CardStackControls>();

    const isEmpty = $derived(controls?.getIsEmpty());
    const topIndex = $derived(controls?.getTopIndex() ?? FIRST_INDEX);
</script>

<div class={styles.deckStage}>
    <PageMeasureBox isFilling height={BOX_HEIGHT}>
        <CardStack
            cards={CARDS}
            isDisabled={props.isDisabled}
            commitRatio={props.commitRatio}
            transitionDurationMs={props.transitionDurationMs}
            mountedCount={props.mountedCount}
            cardGap={props.cardGap}
            funnelRatio={props.funnelRatio}
            pileSide={props.pileSide}
            ariaLabel={"Deck of cards"}
            computeCardLabel={(card) => card}
            onSend={props.onSend}
            onEmpty={props.onEmpty}
            onMount={(next) => {
                controls = next;
            }}
        >
            {#snippet renderCard(state)}
                <div
                    class={styles.deckCard}
                    style:transform={`rotate(${computeCardTilt(state)}deg)`}
                    style:opacity={state.leavingTo === undefined && state.returningFrom === undefined ? SHOWN : GONE}
                    style:transition-duration={`${props.transitionDurationMs}ms`}
                >
                    {state.card}
                </div>
            {/snippet}
        </CardStack>
    </PageMeasureBox>

    <div class={styles.deckControls}>
        {#each DIRECTIONS as direction (direction)}
            <Button
                id={`send-${direction}`}
                isDisabled={props.isDisabled || (isEmpty ?? true)}
                ariaLabel={`Send the top card ${direction}`}
                onClick={() => {
                    controls?.send(direction);
                }}
            >
                {#snippet renderContent(flags)}
                    <PageControlButtonContent {flags} glyph={DIRECTION_GLYPHS[direction]} />
                {/snippet}
            </Button>
        {/each}

        <Button
            id={"recall"}
            isDisabled={props.isDisabled || topIndex === FIRST_INDEX}
            ariaLabel={"Recall the last card"}
            onClick={() => {
                if (controls?.recall()) props.onRecall();
            }}
        >
            {#snippet renderContent(flags)}
                <PageControlButtonContent {flags}>Recall</PageControlButtonContent>
            {/snippet}
        </Button>

        {#if isEmpty}
            <Button
                id={"deal"}
                ariaLabel={"Deal the cards again"}
                onClick={() => {
                    props.onDeal();
                    controls?.deal();
                }}
            >
                {#snippet renderContent(flags)}
                    <PageControlButtonContent {flags} glyph={CONTROL_GLYPHS.replay} />
                {/snippet}
            </Button>
        {/if}
    </div>
</div>
