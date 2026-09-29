import { useEffect, useState } from "react";

import { Button, CardStack } from "@thewaver/ss-components-react";
import type { CardStackControls } from "@thewaver/ss-components-react";
import { computeCardTilt } from "@thewaver/ss-playground/App/Pages/CardStackPage/CardStackPage.const";
import * as styles from "@thewaver/ss-playground/App/Pages/CardStackPage/CardStackPage.css";
import type { SwipeDirection } from "@thewaver/ss-utils";

import { PageMeasureBox } from "../../../PageComponents/MeasureBox/MeasureBox";
import { PageButtonContent } from "../../../StyledComponents/ButtonContent/ButtonContent";
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

export const EndlessExample = (props: Props) => {
    const [controls, setControls] = useState<CardStackControls>();
    const [cards, setCards] = useState(() => computeBatch(FIRST_CARD));

    const onSend = (direction: SwipeDirection, card: string, index: number) => {
        props.onSend(direction, card);

        if (cards.length - (index + NEXT) >= LOW_COUNT) return;

        const nextCards = [...cards, ...computeBatch(cards.length)];

        setCards(nextCards);
        props.onLoad(nextCards.length);
    };

    useEffect(() => {
        props.onLoad(cards.length);
    }, []);

    return (
        <div className={styles.deckStage}>
            <PageMeasureBox isFilling height={BOX_HEIGHT}>
                <CardStack<string>
                    cards={cards}
                    allowedDirections={DIRECTIONS}
                    isDisabled={props.isDisabled}
                    commitRatio={props.commitRatio}
                    transitionDurationMs={props.transitionDurationMs}
                    mountedCount={props.mountedCount}
                    cardGap={props.cardGap}
                    funnelRatio={props.funnelRatio}
                    ariaLabel={"Endless deck"}
                    computeCardLabel={(card) => card}
                    renderCard={(state) => (
                        <div
                            className={styles.deckCard}
                            style={{
                                transform: `rotate(${computeCardTilt(state)}deg)`,
                                opacity: state.leavingTo === undefined ? SHOWN : GONE,
                                transitionDuration: `${props.transitionDurationMs}ms`,
                            }}
                        >
                            {state.card}
                        </div>
                    )}
                    onSend={onSend}
                    onMount={setControls}
                />
            </PageMeasureBox>

            <div className={styles.deckControls}>
                {DIRECTIONS.map((direction) => (
                    <Button
                        key={direction}
                        id={`endless-send-${direction}`}
                        isDisabled={props.isDisabled}
                        ariaLabel={`Send the top card ${direction}`}
                        renderContent={(flags) => (
                            <PageButtonContent flags={flags}>{DIRECTION_LABELS[direction]}</PageButtonContent>
                        )}
                        onClick={() => {
                            controls?.send(direction);
                        }}
                    />
                ))}
            </div>
        </div>
    );
};
