import { For, createSignal } from "solid-js";

import { Button, FLIP_CARD_TURN_DIRECTIONS, FlipCard, Range, access } from "@thewaver/ss-components-solid";
import type { FlipCardAxis, FlipCardTurnDirection } from "@thewaver/ss-components-solid";
import { computeFlipCardFaceLabel } from "@thewaver/ss-playground/App/PageComponents/Announcements/Announcements.const";
import * as styles from "@thewaver/ss-playground/App/Pages/FlipCardPage/FlipCardPage.css";
import { CONTROL_GLYPHS } from "@thewaver/ss-playground/App/StyledComponents/ControlButtonContent/ControlButtonContent.const";

import { PageControlButtonContent } from "../../../StyledComponents/ControlButtonContent/ControlButtonContent";
import {
    PageFlipCardBack,
    PageFlipCardFront,
    PageFlipCardStack,
} from "../../../StyledComponents/FlipCardContent/FlipCardContent";
import { PageRangeContent } from "../../../StyledComponents/RangeContent/RangeContent";
import type { FlipCardPressedExampleProps } from "../FlipCardPage.types";

const CARD_SIZE = { width: 220, height: 300 };

const EDGE_LABELS: Record<FlipCardAxis, Record<FlipCardTurnDirection, string>> = {
    row: { backward: "Press the left edge", forward: "Press the right edge" },
    column: { backward: "Press the bottom edge", forward: "Press the top edge" },
};

const EDGE_GLYPHS: Record<FlipCardAxis, Record<FlipCardTurnDirection, string>> = {
    row: { backward: CONTROL_GLYPHS.left, forward: CONTROL_GLYPHS.right },
    column: { backward: CONTROL_GLYPHS.down, forward: CONTROL_GLYPHS.up },
};

const PERCENT = 100;
const NO_PEEK = 0;
const PEEK_STEP = 1;

type Props = FlipCardPressedExampleProps;

export const PressedExample = (props: Props) => {
    const [, setIsFlipped] = props.flipped;

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
                flipped={props.flipped}
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
                                <PageControlButtonContent
                                    flags={getFlags}
                                    glyph={() => EDGE_GLYPHS[access(props.axis)][direction]}
                                />
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
                    value={[
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
