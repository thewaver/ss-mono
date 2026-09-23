import { Index, Show, createEffect, createMemo, createSignal, on, onCleanup, onMount } from "solid-js";

import { access } from "../../Utils/propUtils";
import { SCRAMBLE_TEXT_DEFAULTS } from "./ScrambleText.const";
import type { ScrambleTextProps } from "./ScrambleText.types";
import { ScrambleTextUtils } from "./ScrambleText.utils";

import * as styles from "./ScrambleText.css";

const NO_DELAY = 0;
const NO_ELAPSED = 0;
const NOTHING_KEPT: boolean[] = [];

export const ScrambleText = (props: ScrambleTextProps) => {
    const [getElapsedMs, setElapsedMs] = createSignal(NO_ELAPSED);
    const [getNoise, setNoise] = createSignal<string[]>([]);
    const [getIsScrambling, setIsScrambling] = createSignal(false);
    const [getKept, setKept] = createSignal(NOTHING_KEPT);

    let scrambleInterval: ReturnType<typeof setInterval> | undefined;
    let startedAtMs = NO_ELAPSED;
    let runSettleTimes: number[] = [];

    onCleanup(() => {
        clearInterval(scrambleInterval);
    });

    const getCharacters = createMemo(() => Array.from(access(props.text)));

    const getSegments = createMemo(() => ScrambleTextUtils.getSegments(getCharacters()));

    const getGlyphSets = createMemo(() => {
        const computeGlyphs = props.computeGlyphs ?? SCRAMBLE_TEXT_DEFAULTS.computeGlyphs;

        return getCharacters().map((character) => Array.from(computeGlyphs(character)));
    });

    const getSettleDurationMs = createMemo(
        () => access(props.settleDurationMs) ?? SCRAMBLE_TEXT_DEFAULTS.settleDurationMs,
    );

    const getInitialDelayMs = createMemo(() => access(props.initialDelayMs) ?? NO_DELAY);

    const getChurnDurationMs = createMemo(() => access(props.churnDurationMs));

    const getScrambleIntervalMs = createMemo(
        () => access(props.scrambleIntervalMs) ?? SCRAMBLE_TEXT_DEFAULTS.scrambleIntervalMs,
    );

    const getSettleTimes = createMemo(() => {
        const characters = getCharacters();

        return ScrambleTextUtils.getSettleTimes(
            ScrambleTextUtils.resolveWeights(characters.length, props.computeCharacterWeights?.(characters.length)),
            getInitialDelayMs(),
            getSettleDurationMs(),
        );
    });

    const getStartTimes = createMemo(() => ScrambleTextUtils.getStartTimes(getSettleTimes(), getChurnDurationMs()));

    const getIsSettled = (index: number) =>
        !getIsScrambling() || !!getKept()[index] || getElapsedMs() >= getSettleTimes()[index];

    const getIsPending = (index: number) => getIsScrambling() && getElapsedMs() < getStartTimes()[index];

    const rollNoise = () => {
        const glyphSets = getGlyphSets();

        setNoise((previous) =>
            getCharacters().map((character, index) => {
                if (ScrambleTextUtils.getIsWhitespace(character)) return character;

                return getIsSettled(index) || getIsPending(index)
                    ? (previous[index] ?? ScrambleTextUtils.pickGlyph(glyphSets[index], character, Math.random()))
                    : ScrambleTextUtils.pickGlyph(glyphSets[index], character, Math.random());
            }),
        );
    };

    const stopScrambling = () => {
        clearInterval(scrambleInterval);
        setIsScrambling(false);
    };

    const getWasSettled = () => {
        const elapsedMs = Date.now() - startedAtMs;
        const kept = getKept();

        return runSettleTimes.map(
            (settleTime, index) => !getIsScrambling() || !!kept[index] || elapsedMs >= settleTime,
        );
    };

    const getKeptAfterChange = (previous: string[], characters: string[]) => {
        const wasSettled = getWasSettled();

        return ScrambleTextUtils.getCarriedIndices(previous, characters).map(
            (from) => from !== undefined && wasSettled[from],
        );
    };

    const startScrambling = (kept = NOTHING_KEPT) => {
        stopScrambling();

        startedAtMs = Date.now();
        runSettleTimes = getSettleTimes();
        setKept(kept);
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
        restartAnimation: () => startScrambling(),
    }));

    createEffect(
        on(getCharacters, (characters, previous) =>
            startScrambling(
                previous && access(props.changedOnly) ? getKeptAfterChange(previous, characters) : NOTHING_KEPT,
            ),
        ),
    );

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
