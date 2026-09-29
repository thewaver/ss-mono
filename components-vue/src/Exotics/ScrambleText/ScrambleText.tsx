import { Fragment, computed, defineComponent, onScopeDispose } from "vue";

import {
    SCRAMBLE_TEXT_DEFAULTS,
    type ScrambleTextController,
    ScrambleTextStyles,
    ScrambleTextUtils,
} from "@thewaver/ss-components";

import { watchAfterRender } from "../../Utils/effectUtils";
import { declareProps } from "../../Utils/propUtils";
import { useStore } from "../../Utils/storeUtils";
import type { ScrambleTextProps } from "./ScrambleText.types";

const NO_DELAY = 0;

export const ScrambleText = defineComponent(
    (props: ScrambleTextProps) => {
        const characters = computed(() => Array.from(props.text));
        const segments = computed(() => ScrambleTextUtils.getSegments(characters.value));

        const glyphSets = computed(() => {
            const computeGlyphs = props.computeGlyphs ?? SCRAMBLE_TEXT_DEFAULTS.computeGlyphs;

            return characters.value.map((character) => Array.from(computeGlyphs(character)));
        });

        const getSettleDurationMs = () => props.settleDurationMs ?? SCRAMBLE_TEXT_DEFAULTS.settleDurationMs;
        const getInitialDelayMs = () => props.initialDelayMs ?? NO_DELAY;

        const settleTimes = computed(() =>
            ScrambleTextUtils.getSettleTimes(
                ScrambleTextUtils.resolveWeights(
                    characters.value.length,
                    props.computeCharacterWeights?.(characters.value.length),
                ),
                getInitialDelayMs(),
                getSettleDurationMs(),
            ),
        );

        const startTimes = computed(() => ScrambleTextUtils.getStartTimes(settleTimes.value, props.churnDurationMs));

        const scrambler = ScrambleTextUtils.createScrambler({
            getCharacters: () => characters.value,
            getGlyphSets: () => glyphSets.value,
            getSettleTimes: () => settleTimes.value,
            getStartTimes: () => startTimes.value,
            getInitialDelayMs,
            getSettleDurationMs,
            getScrambleIntervalMs: () => props.scrambleIntervalMs ?? SCRAMBLE_TEXT_DEFAULTS.scrambleIntervalMs,
            onAnimationEnd: () => props.onAnimationEnd?.(),
        });

        onScopeDispose(() => scrambler.stop());

        const elapsedMs = useStore(scrambler, (state) => state.elapsedMs);
        const noise = useStore(scrambler, (state) => state.noise);
        const isScrambling = useStore(scrambler, (state) => state.isScrambling);
        const kept = useStore(scrambler, (state) => state.kept);

        let previousCharacters: string[] | undefined;

        watchAfterRender([characters], ([next]) => {
            const previous = previousCharacters;

            previousCharacters = next;

            scrambler.start(
                previous && previous !== next && props.changedOnly
                    ? scrambler.getKeptAfterChange(previous, next)
                    : undefined,
            );
        });

        const controller: ScrambleTextController = {
            restartAnimation: () => scrambler.start(),
        };

        watchAfterRender([], () => {
            props.onMount?.(controller);
        });

        return () => {
            const timing = { elapsedMs: elapsedMs.value, isScrambling: isScrambling.value, kept: kept.value };

            return segments.value.map((segment, segmentIndex) =>
                segment.isWhitespace ? (
                    <Fragment key={segmentIndex}>{segment.characters.join("")}</Fragment>
                ) : (
                    <span key={segmentIndex} class={ScrambleTextStyles.scrambleTextWord}>
                        {segment.characters.map((character, offset) => {
                            const index = segment.startIndex + offset;
                            const isSettled = ScrambleTextUtils.getIsSettled(timing, settleTimes.value[index], index);
                            const isPending = ScrambleTextUtils.getIsPending(timing, startTimes.value[index]);

                            return (
                                <span key={offset} class={ScrambleTextStyles.scrambleTextCharacter}>
                                    <span class={isSettled ? undefined : ScrambleTextStyles.scrambleTextSettling}>
                                        {character}
                                    </span>

                                    {!isSettled && !isPending && (
                                        <span class={ScrambleTextStyles.scrambleTextNoise} aria-hidden="true">
                                            {noise.value[index]}
                                        </span>
                                    )}
                                </span>
                            );
                        })}
                    </span>
                ),
            );
        };
    },
    {
        name: "ScrambleText",
        props: declareProps<ScrambleTextProps>({
            text: null,
            settleDurationMs: null,
            churnDurationMs: null,
            scrambleIntervalMs: null,
            initialDelayMs: null,
            computeCharacterWeights: null,
            computeGlyphs: null,
            changedOnly: Boolean,
            onMount: null,
            onAnimationEnd: null,
        }),
    },
);
