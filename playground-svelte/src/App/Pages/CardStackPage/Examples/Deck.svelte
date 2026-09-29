<script lang="ts">
    import { Button, CardStack } from "@thewaver/ss-components-svelte";
    import type { CardStackControls } from "@thewaver/ss-components-svelte";
    import { computeCardTilt } from "@thewaver/ss-playground/App/Pages/CardStackPage/CardStackPage.const";
    import * as styles from "@thewaver/ss-playground/App/Pages/CardStackPage/CardStackPage.css";
    import type { SwipeDirection } from "@thewaver/ss-utils";

    import PageMeasureBox from "../../../PageComponents/MeasureBox/MeasureBox.svelte";
    import PageButtonContent from "../../../StyledComponents/ButtonContent/ButtonContent.svelte";
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
    const DIRECTION_LABELS: Record<SwipeDirection, string> = {
        left: "Left",
        right: "Right",
        up: "Up",
        down: "Down",
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
                    <PageButtonContent {flags}>{DIRECTION_LABELS[direction]}</PageButtonContent>
                {/snippet}
            </Button>
        {/each}

        <Button
            id={"recall"}
            isDisabled={props.isDisabled || topIndex === FIRST_INDEX}
            ariaLabel={"Bring the last card back"}
            onClick={() => {
                if (controls?.recall()) props.onRecall();
            }}
        >
            {#snippet renderContent(flags)}
                <PageButtonContent {flags}>Recall</PageButtonContent>
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
                    <PageButtonContent {flags}>Deal again</PageButtonContent>
                {/snippet}
            </Button>
        {/if}
    </div>
</div>
