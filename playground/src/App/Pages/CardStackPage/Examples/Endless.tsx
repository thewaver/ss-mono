import { For, createSignal, onMount } from "solid-js";

import { Button, CardStack } from "@thewaver/ss-components";
import type { CardStackControls } from "@thewaver/ss-components";
import type { SwipeDirection } from "@thewaver/ss-utils";

import { PageMeasureBox } from "../../../PageComponents/MeasureBox/MeasureBox";
import { PageButtonContent } from "../../../StyledComponents/ButtonContent/ButtonContent";
import type { CardStackEndlessExampleProps } from "../CardStackPage.types";

import * as styles from "../CardStackPage.css";

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

const MAX_TILT_DEGREES = 20;
const SHOWN = 1;
const GONE = 0;

const computeBatch = (from: number) =>
    Array.from({ length: BATCH_SIZE }, (_, offset) => `Card ${from + offset + NEXT}`);

type Props = CardStackEndlessExampleProps;

export const EndlessExample = (props: Props) => {
    const [getControls, setControls] = createSignal<CardStackControls>();
    const [getCards, setCards] = createSignal(computeBatch(FIRST_CARD));

    const onSend = (direction: SwipeDirection, card: string, index: number) => {
        props.onSend(direction, card);

        if (getCards().length - (index + NEXT) >= LOW_COUNT) return;

        setCards((cards) => [...cards, ...computeBatch(cards.length)]);
        props.onLoad(getCards().length);
    };

    onMount(() => {
        props.onLoad(getCards().length);
    });

    return (
        <div class={styles.deckStage}>
            <PageMeasureBox isFilling height={() => BOX_HEIGHT}>
                <CardStack<string>
                    cards={getCards}
                    allowedDirections={DIRECTIONS}
                    isDisabled={props.isDisabled}
                    commitRatio={props.commitRatio}
                    transitionDurationMs={props.transitionDurationMs}
                    mountedCount={props.mountedCount}
                    cardGap={props.cardGap}
                    funnelRatio={props.funnelRatio}
                    ariaLabel={"Endless deck"}
                    computeCardLabel={(card) => card}
                    renderCard={(getState) => (
                        <div
                            class={styles.deckCard}
                            style={{
                                "transform": `rotate(${getState().travel.x * MAX_TILT_DEGREES}deg)`,
                                "opacity": getState().leavingTo === undefined ? SHOWN : GONE,
                                "transition-duration": `${props.transitionDurationMs()}ms`,
                            }}
                        >
                            {getState().card}
                        </div>
                    )}
                    onSend={onSend}
                    onMount={setControls}
                />
            </PageMeasureBox>

            <div class={styles.deckControls}>
                <For each={DIRECTIONS}>
                    {(direction) => (
                        <Button
                            id={`endless-send-${direction}`}
                            isDisabled={props.isDisabled}
                            ariaLabel={`Send the top card ${direction}`}
                            renderContent={(getFlags) => (
                                <PageButtonContent flags={getFlags}>{DIRECTION_LABELS[direction]}</PageButtonContent>
                            )}
                            onClick={() => {
                                getControls()?.send(direction);
                            }}
                        />
                    )}
                </For>
            </div>
        </div>
    );
};
