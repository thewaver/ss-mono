import { Fragment, type SlotsType, computed, defineComponent, onScopeDispose } from "vue";

import {
    LetterDriverUtils,
    type LetterState,
    SCRAMBLE_TEXT_DEFAULTS,
    type ScrambleTextController,
    ScrambleTextStyles,
    ScrambleTextUtils,
} from "@thewaver/ss-components";

import { provideLetterDriverContext } from "../../../Abstracts/LetterDriver/LetterDriver.context";
import { watchAfterRender } from "../../../Utils/effectUtils";
import { declareProps } from "../../../Utils/propUtils";
import { useStore } from "../../../Utils/storeUtils";
import type { SlotsContext } from "../../../Utils/typeUtils";
import type { ScrambleTextProps, ScrambleTextSlots } from "./ScrambleText.types";

const NO_DELAY = 0;

export const ScrambleText = defineComponent(
    (props: ScrambleTextProps, { slots }: SlotsContext<ScrambleTextSlots>) => {
        const registry = LetterDriverUtils.createRegistry();
        const registryState = useStore(registry);
        const getIsDriven = () => registryState.value.entries.length > 0;

        const characters = computed(() =>
            getIsDriven() ? registryState.value.characters : Array.from(props.text ?? ""),
        );
        const segments = computed(() => ScrambleTextUtils.getSegments(characters.value));

        const glyphSets = computed(() => {
            const computeGlyphs = props.computeGlyphs ?? SCRAMBLE_TEXT_DEFAULTS.computeGlyphs;

            return characters.value.map((character) => Array.from(computeGlyphs(character)));
        });

        const getSettleDurationMs = () => props.settleDurationMs ?? SCRAMBLE_TEXT_DEFAULTS.settleDurationMs;
        const getSettleDelayMs = () => props.settleDelayMs ?? NO_DELAY;

        const settleTimes = computed(() =>
            ScrambleTextUtils.getSettleTimes(
                ScrambleTextUtils.resolveWeights(
                    characters.value.length,
                    props.computeCharacterWeights?.(characters.value.length),
                ),
                getSettleDelayMs(),
                getSettleDurationMs(),
            ),
        );

        const startTimes = computed(() => ScrambleTextUtils.getStartTimes(settleTimes.value, props.churnDurationMs));

        const scrambler = ScrambleTextUtils.createScrambler({
            getCharacters: () => characters.value,
            getGlyphSets: () => glyphSets.value,
            getSettleTimes: () => settleTimes.value,
            getStartTimes: () => startTimes.value,
            getSettleDelayMs,
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

        const getTiming = () => ({ elapsedMs: elapsedMs.value, isScrambling: isScrambling.value, kept: kept.value });

        const getLetterState = (index: number): LetterState => {
            const timing = getTiming();
            const isPending = ScrambleTextUtils.getIsPending(timing, startTimes.value[index]);
            const isSettled = ScrambleTextUtils.getIsSettled(timing, settleTimes.value[index], index);

            return { isHidden: isPending, glyph: isSettled || isPending ? undefined : noise.value[index] };
        };

        provideLetterDriverContext({
            registry,
            getLetterState,
            getIsAnimating: () => isScrambling.value,
            getIsHidden: () => false,
        });

        return () => {
            const timing = getTiming();

            const ownText = getIsDriven()
                ? undefined
                : segments.value.map((segment, segmentIndex) =>
                      segment.isWhitespace ? (
                          <Fragment key={segmentIndex}>{segment.characters.join("")}</Fragment>
                      ) : (
                          <span key={segmentIndex} class={ScrambleTextStyles.scrambleTextWord}>
                              {segment.characters.map((character, offset) => {
                                  const index = segment.startIndex + offset;
                                  const isSettled = ScrambleTextUtils.getIsSettled(
                                      timing,
                                      settleTimes.value[index],
                                      index,
                                  );
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

            return (
                <>
                    {slots.default?.()}
                    {ownText}
                </>
            );
        };
    },
    {
        name: "ScrambleText",
        slots: Object as SlotsType<ScrambleTextSlots>,
        props: declareProps<ScrambleTextProps>({
            text: null,
            settleDurationMs: null,
            churnDurationMs: null,
            scrambleIntervalMs: null,
            settleDelayMs: null,
            computeCharacterWeights: null,
            computeGlyphs: null,
            changedOnly: Boolean,
            onMount: null,
            onAnimationEnd: null,
        }),
    },
);
