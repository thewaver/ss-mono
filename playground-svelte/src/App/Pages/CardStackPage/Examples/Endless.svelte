<script lang="ts">
    import { onMount } from "svelte";

    import { Button, CardStack } from "@thewaver/ss-components-svelte";
    import type { CardStackControls } from "@thewaver/ss-components-svelte";
    import { computeCardTilt } from "@thewaver/ss-playground/App/Pages/CardStackPage/CardStackPage.const";
    import * as styles from "@thewaver/ss-playground/App/Pages/CardStackPage/CardStackPage.css";
    import type { SwipeDirection } from "@thewaver/ss-utils";

    import PageMeasureBox from "../../../PageComponents/MeasureBox/MeasureBox.svelte";
    import PageButtonContent from "../../../StyledComponents/ButtonContent/ButtonContent.svelte";
    import type { CardStackEndlessExampleProps } from "../CardStackExamples.types";

    const DIRECTIONS: SwipeDirection[] = ["left", "right"];
    const DIRECTION_LABELS: Record<SwipeDirection, string> = {
        left: "Left",
        right: "Right",
        up: "Up",
        down: "Down",
    };

    const BATCH_SIZE = 6;
    const LOW_COUNT = 3;
    const NEXT = 1;
    const FIRST_CARD = 0;

    const BOX_HEIGHT = 240;

    const SHOWN = 1;
    const GONE = 0;

    const computeBatch = (from: number) =>
        Array.from({ length: BATCH_SIZE }, (_, offset) => `Card ${from + offset + NEXT}`);

    type Props = CardStackEndlessExampleProps;

    let props: Props = $props();

    let controls = $state.raw<CardStackControls>();
    let cards = $state.raw(computeBatch(FIRST_CARD));

    const onSend = (direction: SwipeDirection, card: string, index: number) => {
        props.onSend(direction, card);

        if (cards.length - (index + NEXT) >= LOW_COUNT) return;

        const nextCards = [...cards, ...computeBatch(cards.length)];

        cards = nextCards;
        props.onLoad(nextCards.length);
    };

    onMount(() => {
        props.onLoad(cards.length);
    });
</script>

<div class={styles.deckStage}>
    <PageMeasureBox isFilling height={BOX_HEIGHT}>
        <CardStack
            {cards}
            allowedDirections={DIRECTIONS}
            isDisabled={props.isDisabled}
            commitRatio={props.commitRatio}
            transitionDurationMs={props.transitionDurationMs}
            mountedCount={props.mountedCount}
            cardGap={props.cardGap}
            funnelRatio={props.funnelRatio}
            ariaLabel={"Endless deck"}
            computeCardLabel={(card) => card}
            {onSend}
            onMount={(next) => {
                controls = next;
            }}
        >
            {#snippet renderCard(state)}
                <div
                    class={styles.deckCard}
                    style:transform={`rotate(${computeCardTilt(state)}deg)`}
                    style:opacity={state.leavingTo === undefined ? SHOWN : GONE}
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
                id={`endless-send-${direction}`}
                isDisabled={props.isDisabled}
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
    </div>
</div>
