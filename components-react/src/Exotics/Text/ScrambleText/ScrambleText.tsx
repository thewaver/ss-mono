import { Fragment, useEffect, useMemo, useRef, useState } from "react";

import { SCRAMBLE_TEXT_DEFAULTS, ScrambleTextStyles, ScrambleTextUtils } from "@thewaver/ss-components";

import { useLatest } from "../../../Utils/refUtils";
import { useStore } from "../../../Utils/storeUtils";
import type { ScrambleTextController, ScrambleTextProps } from "./ScrambleText.types";

const NO_DELAY = 0;

export const ScrambleText = (props: ScrambleTextProps) => {
    const characters = useMemo(() => Array.from(props.text), [props.text]);
    const segments = useMemo(() => ScrambleTextUtils.getSegments(characters), [characters]);

    const computeGlyphs = props.computeGlyphs ?? SCRAMBLE_TEXT_DEFAULTS.computeGlyphs;
    const glyphSets = useMemo(
        () => characters.map((character) => Array.from(computeGlyphs(character))),
        [characters, computeGlyphs],
    );

    const settleDurationMs = props.settleDurationMs ?? SCRAMBLE_TEXT_DEFAULTS.settleDurationMs;
    const initialDelayMs = props.initialDelayMs ?? NO_DELAY;
    const scrambleIntervalMs = props.scrambleIntervalMs ?? SCRAMBLE_TEXT_DEFAULTS.scrambleIntervalMs;

    const settleTimes = ScrambleTextUtils.getSettleTimes(
        ScrambleTextUtils.resolveWeights(characters.length, props.computeCharacterWeights?.(characters.length)),
        initialDelayMs,
        settleDurationMs,
    );
    const startTimes = ScrambleTextUtils.getStartTimes(settleTimes, props.churnDurationMs);

    const latest = useLatest({
        props,
        characters,
        glyphSets,
        settleTimes,
        startTimes,
        initialDelayMs,
        settleDurationMs,
        scrambleIntervalMs,
    });

    const [scrambler] = useState(() =>
        ScrambleTextUtils.createScrambler({
            getCharacters: () => latest.current.characters,
            getGlyphSets: () => latest.current.glyphSets,
            getSettleTimes: () => latest.current.settleTimes,
            getStartTimes: () => latest.current.startTimes,
            getInitialDelayMs: () => latest.current.initialDelayMs,
            getSettleDurationMs: () => latest.current.settleDurationMs,
            getScrambleIntervalMs: () => latest.current.scrambleIntervalMs,
            onAnimationEnd: () => latest.current.props.onAnimationEnd?.(),
        }),
    );

    useEffect(() => () => scrambler.stop(), [scrambler]);

    const elapsedMs = useStore(scrambler, (state) => state.elapsedMs);
    const noise = useStore(scrambler, (state) => state.noise);
    const isScrambling = useStore(scrambler, (state) => state.isScrambling);
    const kept = useStore(scrambler, (state) => state.kept);
    const timing = { elapsedMs, isScrambling, kept };

    const previousCharactersRef = useRef<string[]>(undefined);

    useEffect(() => {
        const previous = previousCharactersRef.current;

        previousCharactersRef.current = characters;

        scrambler.start(
            previous && previous !== characters && props.changedOnly
                ? scrambler.getKeptAfterChange(previous, characters)
                : undefined,
        );
    }, [characters]);

    const [controller] = useState<ScrambleTextController>(() => ({
        restartAnimation: () => scrambler.start(),
    }));

    useEffect(() => {
        props.onMount?.(controller);
    }, [controller]);

    return segments.map((segment, segmentIndex) =>
        segment.isWhitespace ? (
            <Fragment key={segmentIndex}>{segment.characters.join("")}</Fragment>
        ) : (
            <span key={segmentIndex} className={ScrambleTextStyles.scrambleTextWord}>
                {segment.characters.map((character, offset) => {
                    const index = segment.startIndex + offset;
                    const isSettled = ScrambleTextUtils.getIsSettled(timing, settleTimes[index], index);
                    const isPending = ScrambleTextUtils.getIsPending(timing, startTimes[index]);

                    return (
                        <span key={offset} className={ScrambleTextStyles.scrambleTextCharacter}>
                            <span className={isSettled ? undefined : ScrambleTextStyles.scrambleTextSettling}>
                                {character}
                            </span>

                            {!isSettled && !isPending && (
                                <span className={ScrambleTextStyles.scrambleTextNoise} aria-hidden="true">
                                    {noise[index]}
                                </span>
                            )}
                        </span>
                    );
                })}
            </span>
        ),
    );
};
