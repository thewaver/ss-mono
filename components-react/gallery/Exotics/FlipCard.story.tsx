import { useState } from "react";

import { FLIP_CARD_TURN_DIRECTIONS, type FlipCardAxis, type FlipCardTurnDirection } from "@thewaver/ss-components";

import { FlipCard } from "../../src";

const CARD_SIZE = { width: 220, height: 300 };
const PERCENT = 100;
const NO_PEEK = 0;

const computeFaceLabel = (face: string) => `${face[0]!.toUpperCase()}${face.slice(1)}`;

export const Pressed = ({ transitionDurationMs = 600 }: { transitionDurationMs?: number }) => {
    const flippedState = useState(false);
    const [isFlipped, setIsFlipped] = flippedState;
    const [axis, setAxis] = useState<FlipCardAxis>("row");
    const [turnDirection, setTurnDirection] = useState<FlipCardTurnDirection>();
    const [peekRatio, setPeekRatio] = useState(NO_PEEK);
    const [lastTurn, setLastTurn] = useState("none");

    const turn = (direction: FlipCardTurnDirection) => {
        setTurnDirection(direction);
        setPeekRatio(NO_PEEK);
        setIsFlipped(!isFlipped);
        setLastTurn(direction);
    };

    return (
        <>
            <FlipCard
                flippedState={flippedState}
                axis={axis}
                size={CARD_SIZE}
                transitionDurationMs={transitionDurationMs}
                turnDirection={turnDirection}
                peekRatio={peekRatio}
                ariaLabel="Queen of spades"
                computeFaceLabel={computeFaceLabel}
                renderFront={(state) => (
                    <div>
                        <div>Q ♠</div>
                        <div>{state.isShowing ? "facing you" : "turned away"}</div>
                    </div>
                )}
                renderBack={(state) => (
                    <div>
                        <div>♥ ♦ ♣</div>
                        <div>{state.isShowing ? "facing you" : "turned away"}</div>
                    </div>
                )}
            />
            {FLIP_CARD_TURN_DIRECTIONS.map((direction) => (
                <button key={direction} id={`press-${direction}`} type="button" onClick={() => turn(direction)}>
                    {direction}
                </button>
            ))}
            <input
                type="range"
                aria-label="Peek at the other side"
                min={NO_PEEK}
                max={PERCENT}
                step={1}
                value={Math.round(peekRatio * PERCENT)}
                onChange={(event) => setPeekRatio(Number(event.currentTarget.value) / PERCENT)}
            />
            <select
                data-testid="axis"
                value={axis}
                onChange={(event) => setAxis(event.currentTarget.value as FlipCardAxis)}
            >
                <option value="row">row</option>
                <option value="column">column</option>
            </select>
            <output data-readout="side">{`${isFlipped ? "back" : "front"}, last turned ${lastTurn}`}</output>
        </>
    );
};
