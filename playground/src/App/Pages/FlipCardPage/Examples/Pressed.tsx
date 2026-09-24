import { For, createSignal } from "solid-js";

import { Button, FLIP_CARD_TURN_DIRECTIONS, FlipCard, Range, access } from "@thewaver/ss-components";
import type { FlipCardAxis, FlipCardTurnDirection } from "@thewaver/ss-components";

import { computeFlipCardFaceLabel } from "../../../PageComponents/Announcements/Announcements.const";
import { PageButtonContent } from "../../../StyledComponents/ButtonContent/ButtonContent";
import {
    PageFlipCardBack,
    PageFlipCardFront,
    PageFlipCardStack,
} from "../../../StyledComponents/FlipCardContent/FlipCardContent";
import { PageRangeContent } from "../../../StyledComponents/RangeContent/RangeContent";
import type { FlipCardPressedExampleProps } from "../FlipCardPage.types";

import * as styles from "../FlipCardPage.css";

const CARD_SIZE = { width: 220, height: 300 };

const EDGE_LABELS: Record<FlipCardAxis, Record<FlipCardTurnDirection, string>> = {
    row: { backward: "Press the left edge", forward: "Press the right edge" },
    column: { backward: "Press the bottom edge", forward: "Press the top edge" },
};

const PERCENT = 100;
const NO_PEEK = 0;
const PEEK_STEP = 1;

type Props = FlipCardPressedExampleProps;

export const PressedExample = (props: Props) => {
    const [, setIsFlipped] = props.flippedSignal;

    const [getTurnDirection, setTurnDirection] = createSignal<FlipCardTurnDirection>();
    const [getPeekRatio, setPeekRatio] = createSignal(NO_PEEK);

    const getEdgeLabel = (direction: FlipCardTurnDirection) => EDGE_LABELS[access(props.axis)][direction];

    const turn = (direction: FlipCardTurnDirection) => {
        setTurnDirection(direction);
        setPeekRatio(NO_PEEK);
        setIsFlipped((isFlipped) => !isFlipped);
        props.onTurn(direction);
    };

    return (
        <PageFlipCardStack>
            <FlipCard
                flippedSignal={props.flippedSignal}
                axis={props.axis}
                size={() => CARD_SIZE}
                transitionDurationMs={props.transitionDurationMs}
                turnDirection={getTurnDirection}
                peekRatio={getPeekRatio}
                ariaLabel={"Queen of spades"}
                computeFaceLabel={computeFlipCardFaceLabel}
                renderFront={(getState) => <PageFlipCardFront state={getState}>Q ♠</PageFlipCardFront>}
                renderBack={(getState) => <PageFlipCardBack state={getState}>♥ ♦ ♣</PageFlipCardBack>}
            />

            <div class={styles.controls}>
                <For each={FLIP_CARD_TURN_DIRECTIONS}>
                    {(direction) => (
                        <Button
                            id={`press-${direction}`}
                            ariaLabel={getEdgeLabel(direction)}
                            renderContent={(getFlags) => (
                                <PageButtonContent flags={getFlags}>{getEdgeLabel(direction)}</PageButtonContent>
                            )}
                            onClick={() => turn(direction)}
                        />
                    )}
                </For>
            </div>

            <div class={styles.slider}>
                <Range
                    id={"peek"}
                    sizing={"fill"}
                    ariaLabel={"Peek at the other side"}
                    min={() => NO_PEEK}
                    max={() => PERCENT}
                    step={() => PEEK_STEP}
                    valueSignal={[
                        () => Math.round(getPeekRatio() * PERCENT),
                        (value: number) => setPeekRatio(value / PERCENT),
                    ]}
                    renderContent={(getRenderProps) => (
                        <PageRangeContent renderProps={getRenderProps} length={() => CARD_SIZE.width} />
                    )}
                />
            </div>
        </PageFlipCardStack>
    );
};
