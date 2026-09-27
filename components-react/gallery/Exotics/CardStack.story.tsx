import { useState, useSyncExternalStore } from "react";

import type { CardStackCardState } from "@thewaver/ss-components";
import type { SwipeDirection } from "@thewaver/ss-utils";

import { CardStack, type CardStackControls } from "../../src";

const CARDS = ["Ace", "King", "Queen", "Jack", "Ten", "Nine", "Eight", "Seven", "Six", "Five", "Four", "Three", "Two"];
const DIRECTIONS: SwipeDirection[] = ["left", "right", "up", "down"];
const SIDEWAYS: SwipeDirection[] = ["left", "right"];
const BOX_WIDTH = 240;
const BOX_HEIGHT = 240;
const MAX_TILT_DEGREES = 20;
const DEFAULT_DURATION_MS = 250;
const BATCH_SIZE = 6;
const LOW_COUNT = 3;
const NO_SUBSCRIPTION = () => () => {};

const Card = ({ state, durationMs }: { state: CardStackCardState<string>; durationMs: number }) => (
    <div
        style={{
            width: "100%",
            height: "100%",
            display: "grid",
            placeItems: "center",
            border: "1px solid #666",
            borderRadius: 8,
            background: "#fff",
            transform: `rotate(${state.travel.x * MAX_TILT_DEGREES}deg)`,
            opacity: state.leavingTo === undefined && state.returningFrom === undefined ? 1 : 0,
            transition: `opacity ${durationMs}ms`,
        }}
    >
        {state.card}
    </div>
);

const useControls = (controls: CardStackControls | undefined) => {
    const topIndex = useSyncExternalStore(controls?.subscribe ?? NO_SUBSCRIPTION, () => controls?.getTopIndex() ?? 0);
    const isEmpty = useSyncExternalStore(controls?.subscribe ?? NO_SUBSCRIPTION, () => controls?.getIsEmpty() ?? true);

    return { topIndex, isEmpty };
};

const DurationField = ({ value, onChange }: { value: number; onChange: (value: number) => void }) => (
    <label data-field="transitionDurationMs">
        Duration
        <input type="number" value={value} onChange={(e) => onChange(Number(e.target.value))} />
    </label>
);

export const Deck = () => {
    const [controls, setControls] = useState<CardStackControls>();
    const [durationMs, setDurationMs] = useState(DEFAULT_DURATION_MS);
    const [readout, setReadout] = useState("nothing sent yet");

    const { topIndex, isEmpty } = useControls(controls);

    return (
        <div data-testid="deck" style={{ padding: 10 }}>
            <DurationField value={durationMs} onChange={setDurationMs} />
            <div style={{ width: BOX_WIDTH, height: BOX_HEIGHT, margin: 40 }}>
                <CardStack<string>
                    cards={CARDS}
                    transitionDurationMs={durationMs}
                    ariaLabel="Deck of cards"
                    computeCardLabel={(card) => card}
                    renderCard={(state) => <Card state={state} durationMs={durationMs} />}
                    onSend={(direction, card) => setReadout(`${card} went ${direction}`)}
                    onEmpty={() => setReadout("the pile is empty")}
                    onMount={setControls}
                />
            </div>
            <div>
                {DIRECTIONS.map((direction) => (
                    <button
                        key={direction}
                        id={`send-${direction}`}
                        aria-disabled={isEmpty || undefined}
                        onClick={() => controls?.send(direction)}
                    >
                        {direction}
                    </button>
                ))}
                <button
                    id="recall"
                    aria-disabled={topIndex === 0 || undefined}
                    onClick={() => {
                        if (controls?.recall()) setReadout("recalled");
                    }}
                >
                    Recall
                </button>
                {isEmpty && (
                    <button
                        id="deal"
                        onClick={() => {
                            setReadout("dealt");
                            controls?.deal();
                        }}
                    >
                        Deal again
                    </button>
                )}
            </div>
            <output data-readout="deck">{readout}</output>
        </div>
    );
};

const computeBatch = (from: number) => Array.from({ length: BATCH_SIZE }, (_, offset) => `Card ${from + offset + 1}`);

export const Endless = () => {
    const [controls, setControls] = useState<CardStackControls>();
    const [durationMs, setDurationMs] = useState(DEFAULT_DURATION_MS);
    const [cards, setCards] = useState(() => computeBatch(0));
    const [readout, setReadout] = useState("left or right only");

    const onSend = (direction: SwipeDirection, card: string, index: number) => {
        const next = cards.length - (index + 1) >= LOW_COUNT ? cards : [...cards, ...computeBatch(cards.length)];

        setCards(next);
        setReadout(`${card} went ${direction} — ${next.length} cards loaded so far`);
    };

    return (
        <div data-testid="endless" style={{ padding: 10 }}>
            <DurationField value={durationMs} onChange={setDurationMs} />
            <div style={{ width: BOX_WIDTH, height: BOX_HEIGHT, margin: 40 }}>
                <CardStack<string>
                    cards={cards}
                    allowedDirections={SIDEWAYS}
                    transitionDurationMs={durationMs}
                    ariaLabel="Endless deck"
                    computeCardLabel={(card) => card}
                    renderCard={(state) => <Card state={state} durationMs={durationMs} />}
                    onSend={onSend}
                    onMount={setControls}
                />
            </div>
            <div>
                {SIDEWAYS.map((direction) => (
                    <button key={direction} id={`endless-send-${direction}`} onClick={() => controls?.send(direction)}>
                        {direction}
                    </button>
                ))}
            </div>
            <output data-readout="endless">{`${readout} (${cards.length} cards loaded)`}</output>
        </div>
    );
};

export const Controlled = () => {
    const topIndexState = useState(0);

    return (
        <div data-testid="controlled" style={{ padding: 10 }}>
            <div style={{ width: BOX_WIDTH, height: BOX_HEIGHT, margin: 40 }}>
                <CardStack<string>
                    cards={CARDS}
                    transitionDurationMs={0}
                    topIndexState={topIndexState}
                    ariaLabel="Controlled deck"
                    computeCardLabel={(card) => card}
                    renderCard={(state) => <Card state={state} durationMs={0} />}
                />
            </div>
            <button id="skip" onClick={() => topIndexState[1](topIndexState[0] + 2)}>
                Skip two
            </button>
            <output data-readout="controlled">{`top index ${topIndexState[0]}`}</output>
        </div>
    );
};

export const Disabled = () => (
    <div data-testid="disabled" style={{ padding: 10 }}>
        <div style={{ width: BOX_WIDTH, height: BOX_HEIGHT, margin: 40 }}>
            <CardStack<string>
                cards={CARDS}
                isDisabled={true}
                ariaLabel="Disabled deck"
                computeCardLabel={(card) => card}
                renderCard={(state) => <Card state={state} durationMs={DEFAULT_DURATION_MS} />}
            />
        </div>
    </div>
);
