import { useState, useSyncExternalStore } from "react";

import { Button, CardStack } from "@thewaver/ss-components-react";
import type { CardStackControls } from "@thewaver/ss-components-react";
import { computeCardTilt } from "@thewaver/ss-playground/App/Pages/CardStackPage/CardStackPage.const";
import * as styles from "@thewaver/ss-playground/App/Pages/CardStackPage/CardStackPage.css";
import type { SwipeDirection } from "@thewaver/ss-utils";

import { PageMeasureBox } from "../../../PageComponents/MeasureBox/MeasureBox";
import { PageButtonContent } from "../../../StyledComponents/ButtonContent/ButtonContent";
import type { CardStackDeckExampleProps } from "../CardStackExamples.types";

const CARDS = ["Ace", "King", "Queen", "Jack", "Ten", "Nine", "Eight", "Seven", "Six", "Five", "Four", "Three", "Two"];
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

const NO_SUBSCRIPTION = () => () => {};

type Props = CardStackDeckExampleProps;

export const DeckExample = (props: Props) => {
    const [controls, setControls] = useState<CardStackControls>();

    const subscribe = controls?.subscribe ?? NO_SUBSCRIPTION;
    const isEmpty = useSyncExternalStore(subscribe, () => controls?.getIsEmpty());
    const topIndex = useSyncExternalStore(subscribe, () => controls?.getTopIndex() ?? FIRST_INDEX);

    return (
        <div className={styles.deckStage}>
            <PageMeasureBox isFilling height={BOX_HEIGHT}>
                <CardStack<string>
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
                    renderCard={(state) => (
                        <div
                            className={styles.deckCard}
                            style={{
                                transform: `rotate(${computeCardTilt(state)}deg)`,
                                opacity:
                                    state.leavingTo === undefined && state.returningFrom === undefined ? SHOWN : GONE,
                                transitionDuration: `${props.transitionDurationMs}ms`,
                            }}
                        >
                            {state.card}
                        </div>
                    )}
                    onSend={props.onSend}
                    onEmpty={props.onEmpty}
                    onMount={setControls}
                />
            </PageMeasureBox>

            <div className={styles.deckControls}>
                {DIRECTIONS.map((direction) => (
                    <Button
                        key={direction}
                        id={`send-${direction}`}
                        isDisabled={props.isDisabled || (isEmpty ?? true)}
                        ariaLabel={`Send the top card ${direction}`}
                        renderContent={(flags) => (
                            <PageButtonContent flags={flags}>{DIRECTION_LABELS[direction]}</PageButtonContent>
                        )}
                        onClick={() => {
                            controls?.send(direction);
                        }}
                    />
                ))}

                <Button
                    id={"recall"}
                    isDisabled={props.isDisabled || topIndex === FIRST_INDEX}
                    ariaLabel={"Bring the last card back"}
                    renderContent={(flags) => <PageButtonContent flags={flags}>Recall</PageButtonContent>}
                    onClick={() => {
                        if (controls?.recall()) props.onRecall();
                    }}
                />

                {isEmpty && (
                    <Button
                        id={"deal"}
                        ariaLabel={"Deal the cards again"}
                        renderContent={(flags) => <PageButtonContent flags={flags}>Deal again</PageButtonContent>}
                        onClick={() => {
                            props.onDeal();
                            controls?.deal();
                        }}
                    />
                )}
            </div>
        </div>
    );
};
