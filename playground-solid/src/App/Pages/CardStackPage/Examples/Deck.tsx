import { For, Show, createSignal } from "solid-js";

import { Button, CardStack } from "@thewaver/ss-components-solid";
import type { CardStackControls } from "@thewaver/ss-components-solid";
import { computeCardTilt } from "@thewaver/ss-playground/App/Pages/CardStackPage/CardStackPage.const";
import * as styles from "@thewaver/ss-playground/App/Pages/CardStackPage/CardStackPage.css";
import type { CardStackDeckExampleProps } from "@thewaver/ss-playground/App/Pages/CardStackPage/CardStackPage.types";
import type { SwipeDirection } from "@thewaver/ss-utils";

import { PageMeasureBox } from "../../../PageComponents/MeasureBox/MeasureBox";
import { PageButtonContent } from "../../../StyledComponents/ButtonContent/ButtonContent";

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
                    pileSide={props.pileSide}
                    ariaLabel={"Deck of cards"}
                    computeCardLabel={(card) => card}
                    renderCard={(getState) => (
                        <div
                            class={styles.deckCard}
                            style={{
                                "transform": `rotate(${computeCardTilt(getState())}deg)`,
                                "opacity":
                                    getState().leavingTo === undefined && getState().returningFrom === undefined
                                        ? SHOWN
                                        : GONE,
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

                <Button
                    id={"recall"}
                    isDisabled={() =>
                        props.isDisabled() || (getControls()?.getTopIndex() ?? FIRST_INDEX) === FIRST_INDEX
                    }
                    ariaLabel={"Bring the last card back"}
                    renderContent={(getFlags) => <PageButtonContent flags={getFlags}>Recall</PageButtonContent>}
                    onClick={() => {
                        if (getControls()?.recall()) props.onRecall();
                    }}
                />

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
