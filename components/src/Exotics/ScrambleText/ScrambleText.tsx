import { Index, Show, createEffect, createMemo, createSignal, on, onCleanup, onMount } from "solid-js";

import { access } from "../../Utils/propUtils";
import type { ScrambleTextProps } from "./ScrambleText.types";
import { ScrambleTextUtils } from "./ScrambleText.utils";

import * as styles from "./ScrambleText.css";

const DEFAULT_GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#%&@*+=<>/\\";
const DEFAULT_SETTLE_DURATION_MS = 900;
const DEFAULT_SCRAMBLE_INTERVAL_MS = 45;
const NO_DELAY = 0;
const NO_ELAPSED = 0;

export const ScrambleText = (props: ScrambleTextProps) => {
    const [getElapsedMs, setElapsedMs] = createSignal(NO_ELAPSED);
    const [getNoise, setNoise] = createSignal<string[]>([]);
    const [getIsScrambling, setIsScrambling] = createSignal(false);

    let scrambleInterval: ReturnType<typeof setInterval> | undefined;
    let startedAtMs = NO_ELAPSED;

    onCleanup(() => {
        clearInterval(scrambleInterval);
    });

    const getCharacters = createMemo(() => Array.from(access(props.text)));

    const getSegments = createMemo(() => ScrambleTextUtils.getSegments(getCharacters()));

    const getGlyphs = createMemo(() => Array.from(access(props.glyphs) ?? DEFAULT_GLYPHS));

    const getSettleDurationMs = createMemo(() => access(props.settleDurationMs) ?? DEFAULT_SETTLE_DURATION_MS);

    const getInitialDelayMs = createMemo(() => access(props.initialDelayMs) ?? NO_DELAY);

    const getChurnDurationMs = createMemo(() => access(props.churnDurationMs));

    const getScrambleIntervalMs = createMemo(() => access(props.scrambleIntervalMs) ?? DEFAULT_SCRAMBLE_INTERVAL_MS);

    const getSettleTimes = createMemo(() => {
        const characters = getCharacters();

        return ScrambleTextUtils.getSettleTimes(
            ScrambleTextUtils.resolveWeights(characters.length, props.computeCharacterWeights?.(characters.length)),
            getInitialDelayMs(),
            getSettleDurationMs(),
        );
    });

    const getStartTimes = createMemo(() => ScrambleTextUtils.getStartTimes(getSettleTimes(), getChurnDurationMs()));

    const getIsSettled = (index: number) => !getIsScrambling() || getElapsedMs() >= getSettleTimes()[index];

    const getIsPending = (index: number) => getIsScrambling() && getElapsedMs() < getStartTimes()[index];

    const rollNoise = () => {
        const glyphs = getGlyphs();

        setNoise(getCharacters().map((character) => ScrambleTextUtils.pickGlyph(glyphs, character, Math.random())));
    };

    const stopScrambling = () => {
        clearInterval(scrambleInterval);
        setIsScrambling(false);
    };

    const startScrambling = () => {
        stopScrambling();

        startedAtMs = Date.now();
        setElapsedMs(NO_ELAPSED);
        rollNoise();
        setIsScrambling(true);

        scrambleInterval = setInterval(() => {
            const elapsedMs = Date.now() - startedAtMs;

            setElapsedMs(elapsedMs);
            rollNoise();

            if (elapsedMs < getInitialDelayMs() + getSettleDurationMs()) return;

            stopScrambling();
            props.onAnimationEnd?.();
        }, getScrambleIntervalMs());

        return true;
    };

    const controller = createMemo(() => ({
        restartAnimation: () => {
            if (getIsScrambling()) return false;

            return startScrambling();
        },
    }));

    createEffect(on(getCharacters, () => startScrambling()));

    onMount(() => {
        props.onMount?.(controller());
    });

    return (
        <Index each={getSegments()}>
            {(getSegment) => (
                <Show when={!getSegment().isWhitespace} fallback={<>{getSegment().characters.join("")}</>}>
                    <span class={styles.scrambleTextWord}>
                        <Index each={getSegment().characters}>
                            {(getCharacter, offset) => {
                                const getIndex = () => getSegment().startIndex + offset;

                                return (
                                    <span class={styles.scrambleTextCharacter}>
                                        <span
                                            classList={{
                                                [styles.scrambleTextSettling]: !getIsSettled(getIndex()),
                                            }}
                                        >
                                            {getCharacter()}
                                        </span>

                                        {!getIsSettled(getIndex()) && !getIsPending(getIndex()) && (
                                            <span class={styles.scrambleTextNoise} aria-hidden="true">
                                                {getNoise()[getIndex()]}
                                            </span>
                                        )}
                                    </span>
                                );
                            }}
                        </Index>
                    </span>
                </Show>
            )}
        </Index>
    );
};
