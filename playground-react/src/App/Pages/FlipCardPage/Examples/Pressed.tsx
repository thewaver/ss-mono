import { useState } from "react";

import { Button, FLIP_CARD_TURN_DIRECTIONS, FlipCard, Range } from "@thewaver/ss-components-react";
import type { FlipCardAxis, FlipCardTurnDirection } from "@thewaver/ss-components-react";
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
    const [isFlipped, setIsFlipped] = props.flipped;

    const [turnDirection, setTurnDirection] = useState<FlipCardTurnDirection>();
    const [peekRatio, setPeekRatio] = useState(NO_PEEK);

    const getEdgeLabel = (direction: FlipCardTurnDirection) => EDGE_LABELS[props.axis][direction];

    const turn = (direction: FlipCardTurnDirection) => {
        setTurnDirection(direction);
        setPeekRatio(NO_PEEK);
        setIsFlipped(!isFlipped);
        props.onTurn(direction);
    };

    return (
        <PageFlipCardStack>
            <FlipCard
                flipped={props.flipped}
                axis={props.axis}
                size={CARD_SIZE}
                transitionDurationMs={props.transitionDurationMs}
                turnDirection={turnDirection}
                peekRatio={peekRatio}
                ariaLabel={"Queen of spades"}
                computeFaceLabel={computeFlipCardFaceLabel}
                renderFront={(state) => <PageFlipCardFront state={state}>Q ♠</PageFlipCardFront>}
                renderBack={(state) => <PageFlipCardBack state={state}>♥ ♦ ♣</PageFlipCardBack>}
            />

            <div className={styles.controls}>
                {FLIP_CARD_TURN_DIRECTIONS.map((direction) => (
                    <Button
                        key={direction}
                        id={`press-${direction}`}
                        ariaLabel={getEdgeLabel(direction)}
                        renderContent={(flags) => (
                            <PageControlButtonContent flags={flags} glyph={EDGE_GLYPHS[props.axis][direction]} />
                        )}
                        onClick={() => turn(direction)}
                    />
                ))}
            </div>

            <div className={styles.slider}>
                <Range
                    id={"peek"}
                    sizing={"fill"}
                    ariaLabel={"Peek at the other side"}
                    min={NO_PEEK}
                    max={PERCENT}
                    step={PEEK_STEP}
                    value={[Math.round(peekRatio * PERCENT), (value: number) => setPeekRatio(value / PERCENT)]}
                    renderContent={(renderProps) => (
                        <PageRangeContent renderProps={renderProps} length={CARD_SIZE.width} />
                    )}
                />
            </div>
        </PageFlipCardStack>
    );
};
