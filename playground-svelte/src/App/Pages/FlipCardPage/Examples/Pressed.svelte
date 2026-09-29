<script lang="ts">
    import { Button, FLIP_CARD_TURN_DIRECTIONS, FlipCard, Range } from "@thewaver/ss-components-svelte";
    import type { FlipCardAxis, FlipCardTurnDirection } from "@thewaver/ss-components-svelte";
    import { computeFlipCardFaceLabel } from "@thewaver/ss-playground/App/PageComponents/Announcements/Announcements.const";
    import * as styles from "@thewaver/ss-playground/App/Pages/FlipCardPage/FlipCardPage.css";

    import PageButtonContent from "../../../StyledComponents/ButtonContent/ButtonContent.svelte";
    import PageFlipCardBack from "../../../StyledComponents/FlipCardContent/PageFlipCardBack.svelte";
    import PageFlipCardFront from "../../../StyledComponents/FlipCardContent/PageFlipCardFront.svelte";
    import PageFlipCardStack from "../../../StyledComponents/FlipCardContent/PageFlipCardStack.svelte";
    import PageRangeContent from "../../../StyledComponents/RangeContent/RangeContent.svelte";
    import type { FlipCardPressedExampleProps } from "../FlipCardPage.types";

    const CARD_SIZE = { width: 220, height: 300 };

    const EDGE_LABELS: Record<FlipCardAxis, Record<FlipCardTurnDirection, string>> = {
        row: { backward: "Press the left edge", forward: "Press the right edge" },
        column: { backward: "Press the bottom edge", forward: "Press the top edge" },
    };

    const PERCENT = 100;
    const NO_PEEK = 0;
    const PEEK_STEP = 1;

    type Props = FlipCardPressedExampleProps;

    let { flipped = $bindable(), ...props }: Props = $props();

    let turnDirection = $state<FlipCardTurnDirection>();
    let peekRatio = $state(NO_PEEK);

    const getEdgeLabel = (direction: FlipCardTurnDirection) => EDGE_LABELS[props.axis][direction];

    const turn = (direction: FlipCardTurnDirection) => {
        turnDirection = direction;
        peekRatio = NO_PEEK;
        flipped = !flipped;
        props.onTurn(direction);
    };
</script>

<PageFlipCardStack>
    <FlipCard
        bind:flipped
        axis={props.axis}
        size={CARD_SIZE}
        transitionDurationMs={props.transitionDurationMs}
        {turnDirection}
        {peekRatio}
        ariaLabel={"Queen of spades"}
        computeFaceLabel={computeFlipCardFaceLabel}
    >
        {#snippet renderFront(state)}
            <PageFlipCardFront {state}>Q ♠</PageFlipCardFront>
        {/snippet}

        {#snippet renderBack(state)}
            <PageFlipCardBack {state}>♥ ♦ ♣</PageFlipCardBack>
        {/snippet}
    </FlipCard>

    <div class={styles.controls}>
        {#each FLIP_CARD_TURN_DIRECTIONS as direction (direction)}
            <Button id={`press-${direction}`} ariaLabel={getEdgeLabel(direction)} onClick={() => turn(direction)}>
                {#snippet renderContent(flags)}
                    <PageButtonContent {flags}>{getEdgeLabel(direction)}</PageButtonContent>
                {/snippet}
            </Button>
        {/each}
    </div>

    <div class={styles.slider}>
        <Range
            id={"peek"}
            sizing={"fill"}
            ariaLabel={"Peek at the other side"}
            min={NO_PEEK}
            max={PERCENT}
            step={PEEK_STEP}
            bind:value={
                () => Math.round(peekRatio * PERCENT),
                (value) => {
                    if (value !== undefined) peekRatio = value / PERCENT;
                }
            }
        >
            {#snippet renderContent(renderProps)}
                <PageRangeContent {renderProps} length={CARD_SIZE.width} />
            {/snippet}
        </Range>
    </div>
</PageFlipCardStack>
