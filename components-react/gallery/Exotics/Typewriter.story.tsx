import { useEffect, useRef, useState } from "react";

import { ScrambleTextWeights, type TypewriterMode } from "@thewaver/ss-components";

import { Typewriter, type TypewriterController } from "../../src";
import crimson from "../crimson.png";

const PHRASES = ["websites", "apps", "games"];
const HOLD_MS = 1600;
const CHARACTER_DELAY_MS = 80;
const CHARACTER_DURATION_MS = 200;
const FADE_NAME = "storyTypewriterFade";
const FADE_KEYFRAMES = `@keyframes ${FADE_NAME} { from { opacity: 0; } to { opacity: 1; } }`;
const CARET_STYLE = {
    display: "inline-block",
    width: 2,
    height: "1em",
    marginLeft: 1,
    verticalAlign: "text-bottom",
    background: "currentColor",
};

type ArrivalOrder = "leftToRight" | ScrambleTextWeights.SampleKey;

const computeWeights = (order: ArrivalOrder) => (count: number) =>
    order === "leftToRight" ? [] : ScrambleTextWeights.SAMPLE_WEIGHTS[order](count);

export const Complex = () => {
    const [width, setWidth] = useState(480);
    const [widthText, setWidthText] = useState("480");

    return (
        <>
            <input
                id="textContainerWidth"
                type="number"
                value={widthText}
                onChange={(event) => setWidthText(event.currentTarget.value)}
                onBlur={() => setWidth(Number(widthText))}
            />
            <style>{FADE_KEYFRAMES}</style>
            <div data-testid="complex" style={{ width }}>
                <Typewriter animationName={FADE_NAME}>
                    This is a bit of{" "}
                    <b>
                        text that appears
                        <div style={{ color: "red" }} title="ONE MEANS ONE!">
                            <i>one</i>
                        </div>
                    </b>
                    <span>single</span>
                    {" text character\tat a time,"}
                    <br />
                    <br />
                    <div style={{ width: "100%", height: "0.5em", borderBottom: "2px solid currentColor" }} />
                    {"and has\nescaped "}
                    <img src={crimson} height={24} style={{ verticalAlign: "middle" }} />
                    <a href="http://www.example.com">characters.</a>
                </Typewriter>
            </div>
        </>
    );
};

export const Phrases = () => {
    const [controller, setController] = useState<TypewriterController>();
    const [phraseIndex, setPhraseIndex] = useState(0);
    const [mode, setMode] = useState<TypewriterMode>("type");
    const [isPaused, setIsPaused] = useState(false);
    const [arrivalOrder, setArrivalOrder] = useState<ArrivalOrder>("leftToRight");

    const holdTimeoutRef = useRef<ReturnType<typeof setTimeout>>(undefined);
    const isStepWaitingRef = useRef(false);
    const latest = useRef({ mode, isPaused, controller });

    latest.current = { mode, isPaused, controller };

    useEffect(() => () => clearTimeout(holdTimeoutRef.current), []);

    const step = () => {
        isStepWaitingRef.current = false;

        if (latest.current.mode === "type") {
            setMode("erase");

            return;
        }

        setPhraseIndex((index) => (index + 1) % PHRASES.length);
        setMode("type");
        latest.current.controller?.update("content");
    };

    const requestStep = () => {
        if (latest.current.isPaused) {
            isStepWaitingRef.current = true;

            return;
        }

        step();
    };

    const handleAnimationEnd = () => {
        clearTimeout(holdTimeoutRef.current);

        if (latest.current.mode === "erase") {
            requestStep();

            return;
        }

        holdTimeoutRef.current = setTimeout(requestStep, HOLD_MS);
    };

    const togglePause = () => {
        const isNowPaused = !isPaused;

        setIsPaused(isNowPaused);
        latest.current = { ...latest.current, isPaused: isNowPaused };

        if (!isNowPaused && isStepWaitingRef.current) step();
    };

    return (
        <>
            <style>{FADE_KEYFRAMES}</style>
            <div data-testid="phrases" style={{ width: 320, display: "flex", alignItems: "baseline", gap: 8 }}>
                <span>We build</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                    <Typewriter
                        mode={mode}
                        animationName={FADE_NAME}
                        animationDelayMs={CHARACTER_DELAY_MS}
                        animationDurationMs={CHARACTER_DURATION_MS}
                        computeCharacterWeights={computeWeights(arrivalOrder)}
                        renderCaret={() => <span style={CARET_STYLE} aria-hidden="true" />}
                        onMount={setController}
                        onAnimationEnd={handleAnimationEnd}
                    >
                        {PHRASES[phraseIndex]}
                    </Typewriter>
                </div>
            </div>
            <button id="pausePhrases" type="button" onClick={togglePause}>
                {isPaused ? "Resume" : "Pause"}
            </button>
            <select
                data-testid="arrivalOrder"
                value={arrivalOrder}
                onChange={(event) => setArrivalOrder(event.currentTarget.value as ArrivalOrder)}
            >
                <option value="leftToRight">leftToRight</option>
                {ScrambleTextWeights.SAMPLE_KEYS.map((key) => (
                    <option key={key} value={key}>
                        {key}
                    </option>
                ))}
            </select>
        </>
    );
};
