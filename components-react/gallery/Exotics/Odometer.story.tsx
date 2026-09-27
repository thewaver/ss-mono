import { type ReactNode, useState } from "react";

import { OdometerReels, type OdometerSlotFlags } from "@thewaver/ss-components";

import { Odometer } from "../../src";

const DIGIT_SIZE = { width: 34, height: 52 };
const GROUP_SIZE = 3;
const REEL_DIGITS = 4;
const REEL_RANGE = 10 ** REEL_DIGITS;

const group = (value: number) => {
    const digits = String(Math.abs(value));
    const grouped = Array.from(digits)
        .map((digit, index) => ((digits.length - index) % GROUP_SIZE === 0 && index > 0 ? `,${digit}` : digit))
        .join("");

    return value < 0 ? `-${grouped}` : grouped;
};

const Fade = ({ flags, children }: { flags: OdometerSlotFlags; children: ReactNode }) => (
    <div
        className={[flags.isEntering ? "is-entering" : "", flags.isLeaving ? "is-leaving" : ""].join(" ").trim()}
        style={{ width: "100%", height: "100%", display: "grid", placeItems: "center", background: "#eee" }}
    >
        {children}
    </div>
);

const NumberField = ({ id, value, onCommit }: { id: string; value: number; onCommit: (value: number) => void }) => {
    const [text, setText] = useState(String(value));

    return (
        <input
            id={id}
            type="number"
            value={text}
            onChange={(event) => setText(event.currentTarget.value)}
            onBlur={() => onCommit(Number(text))}
        />
    );
};

export const Counter = () => {
    const [value, setValue] = useState(199);
    const [turnDurationMs, setTurnDurationMs] = useState(600);
    const [cascadeDelayMs, setCascadeDelayMs] = useState(90);

    return (
        <>
            <div data-demo="counter">
                <Odometer
                    text={group(value)}
                    digitSize={DIGIT_SIZE}
                    turnDurationMs={turnDurationMs}
                    cascadeDelayMs={cascadeDelayMs}
                    ariaLabel="Score"
                    renderDigit={(digit, flags) => <Fade flags={flags}>{digit}</Fade>}
                    renderFixed={(character, flags) => <Fade flags={flags}>{character}</Fade>}
                />
            </div>
            <button id="stepDown" type="button" onClick={() => setValue((current) => current - 1)}>
                take 1
            </button>
            <button id="stepUp" type="button" onClick={() => setValue((current) => current + 1)}>
                add 1
            </button>
            <NumberField key={`value-${value}`} id="value" value={value} onCommit={setValue} />
            <NumberField id="turnDurationMs" value={turnDurationMs} onCommit={setTurnDurationMs} />
            <NumberField id="cascadeDelayMs" value={cascadeDelayMs} onCommit={setCascadeDelayMs} />
        </>
    );
};

export const Reels = () => {
    const [value, setValue] = useState(7);
    const [reelKey, setReelKey] = useState<OdometerReels.SampleKey>("leftToRight");

    return (
        <>
            <div data-demo="reels">
                <Odometer
                    text={String(value).padStart(REEL_DIGITS, "0")}
                    digitSize={DIGIT_SIZE}
                    ariaLabel="Slot machine"
                    computeReel={(digitIndex, digitCount) =>
                        OdometerReels.SAMPLE_REELS[reelKey](digitIndex, digitCount)
                    }
                />
            </div>
            <button
                id="pullReels"
                type="button"
                onClick={() =>
                    setValue((current) => {
                        const next = Math.floor(Math.random() * REEL_RANGE);

                        return next === current ? (next + 1) % REEL_RANGE : next;
                    })
                }
            >
                Pull
            </button>
            <select
                data-testid="reelKey"
                value={reelKey}
                onChange={(event) => setReelKey(event.currentTarget.value as OdometerReels.SampleKey)}
            >
                {OdometerReels.SAMPLE_KEYS.map((key) => (
                    <option key={key} value={key}>
                        {key}
                    </option>
                ))}
            </select>
        </>
    );
};
