import { Index, Show, createEffect, createMemo, on, onCleanup, onMount } from "solid-js";
import type { ParentProps } from "solid-js";

import {
    LetterDriverUtils,
    type LetterState,
    SCRAMBLE_TEXT_DEFAULTS,
    ScrambleTextUtils,
    ScrambleTextStyles as styles,
} from "@thewaver/ss-components";

import { LetterDriverContextProvider } from "../../../Abstracts/LetterDriver/LetterDriver.context";
import type { LetterDriverContextType } from "../../../Abstracts/LetterDriver/LetterDriverSolid.context.types";
import { access } from "../../../Utils/propUtils";
import { accessStore } from "../../../Utils/storeUtils";
import type { ScrambleTextProps } from "./ScrambleTextSolid.types";

const NO_DELAY = 0;

export const ScrambleText = (props: ParentProps<ScrambleTextProps>) => {
    const registry = LetterDriverUtils.createRegistry();

    const getIsDriven = accessStore(registry, (state) => state.entries.length > 0);

    const getDrivenCharacters = accessStore(registry, (state) => state.characters);

    const getCharacters = createMemo(
        () => (getIsDriven() ? getDrivenCharacters() : Array.from(access(props.text) ?? "")),
        undefined,
        { equals: (a, b) => a.join("") === b.join("") },
    );

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

    const scrambler = ScrambleTextUtils.createScrambler({
        getCharacters,
        getGlyphSets,
        getSettleTimes,
        getStartTimes,
        getInitialDelayMs,
        getSettleDurationMs,
        getScrambleIntervalMs,
        onAnimationEnd: () => props.onAnimationEnd?.(),
    });

    onCleanup(scrambler.stop);

    const getElapsedMs = accessStore(scrambler, (state) => state.elapsedMs);

    const getNoise = accessStore(scrambler, (state) => state.noise);

    const getIsScrambling = accessStore(scrambler, (state) => state.isScrambling);

    const getKept = accessStore(scrambler, (state) => state.kept);

    const getTiming = () => ({ elapsedMs: getElapsedMs(), isScrambling: getIsScrambling(), kept: getKept() });

    const getIsSettled = (index: number) => ScrambleTextUtils.getIsSettled(getTiming(), getSettleTimes()[index], index);

    const getIsPending = (index: number) => ScrambleTextUtils.getIsPending(getTiming(), getStartTimes()[index]);

    const controller = createMemo(() => ({
        restartAnimation: () => scrambler.start(),
    }));

    createEffect(
        on(getCharacters, (characters, previous) =>
            scrambler.start(
                previous && access(props.changedOnly) ? scrambler.getKeptAfterChange(previous, characters) : undefined,
            ),
        ),
    );

    onMount(() => {
        props.onMount?.(controller());
    });

    const getLetterState = (index: number): LetterState => {
        const isPending = getIsPending(index);

        return {
            isHidden: isPending,
            glyph: getIsSettled(index) || isPending ? undefined : getNoise()[index],
        };
    };

    const driver: LetterDriverContextType = {
        registry,
        getLetterState,
        getIsAnimating: getIsScrambling,
        getIsHidden: () => false,
    };

    return (
        <LetterDriverContextProvider value={driver}>
            {props.children}

            <Show when={!getIsDriven()}>
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
            </Show>
        </LetterDriverContextProvider>
    );
};
