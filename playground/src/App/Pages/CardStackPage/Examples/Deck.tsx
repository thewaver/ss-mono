import { For, Show, createSignal } from "solid-js";

import { Button, CardStack } from "@thewaver/ss-components";
import type { CardStackControls } from "@thewaver/ss-components";
import type { SwipeDirection } from "@thewaver/ss-utils";

import { PageMeasureBox } from "../../../PageComponents/MeasureBox/MeasureBox";
import { PageButtonContent } from "../../../StyledComponents/ButtonContent/ButtonContent";
import type { CardStackDeckExampleProps } from "../CardStackPage.types";

import * as styles from "../CardStackPage.css";

const CARDS = ["Ace", "King", "Queen", "Jack", "Ten", "Nine", "Eight", "Seven", "Six", "Five", "Four", "Three", "Two"];
const DIRECTIONS: SwipeDirection[] = ["left", "right", "up", "down"];
const DIRECTION_LABELS: Record<SwipeDirection, string> = {
    left: "Left",
    right: "Right",
    up: "Up",
    down: "Down",
};

const BOX_HEIGHT = 240;

const MAX_TILT_DEGREES = 20;
const SHOWN = 1;
const GONE = 0;

type Props = CardStackDeckExampleProps;

export const DeckExample = (props: Props) => {
    const [getControls, setControls] = createSignal<CardStackControls>();

    return (
        <div class={styles.deckStage}>
            <PageMeasureBox isFilling height={() => BOX_HEIGHT}>
                <CardStack<string>
                    cards={CARDS}
                    isDisabled={props.isDisabled}
                    commitRatio={props.commitRatio}
                    transitionDurationMs={props.transitionDurationMs}
                    mountedCount={props.mountedCount}
                    cardGap={props.cardGap}
                    funnelRatio={props.funnelRatio}
                    ariaLabel={"Deck of cards"}
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
                    onSend={props.onSend}
                    onEmpty={props.onEmpty}
                    onMount={setControls}
                />
            </PageMeasureBox>

            <div class={styles.deckControls}>
                <For each={DIRECTIONS}>
                    {(direction) => (
                        <Button
                            id={`send-${direction}`}
                            isDisabled={() => props.isDisabled() || (getControls()?.getIsEmpty() ?? true)}
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

                <Show when={getControls()?.getIsEmpty()}>
                    <Button
                        id={"deal"}
                        ariaLabel={"Deal the cards again"}
                        renderContent={(getFlags) => <PageButtonContent flags={getFlags}>Deal again</PageButtonContent>}
                        onClick={() => {
                            props.onDeal();
                            getControls()?.deal();
                        }}
                    />
                </Show>
            </div>
        </div>
    );
};
