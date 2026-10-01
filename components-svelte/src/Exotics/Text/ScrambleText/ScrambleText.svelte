<script lang="ts">
    import { untrack } from "svelte";

    import { SCRAMBLE_TEXT_DEFAULTS, ScrambleTextUtils, ScrambleTextStyles as styles } from "@thewaver/ss-components";

    import { readStore } from "../../../Utils/storeUtils.js";
    import type { ScrambleTextController, ScrambleTextProps } from "./ScrambleText.types.js";

    const NO_DELAY = 0;

    let props: ScrambleTextProps = $props();

    const characters = $derived(Array.from(props.text));
    const segments = $derived(ScrambleTextUtils.getSegments(characters));

    const computeGlyphs = $derived(props.computeGlyphs ?? SCRAMBLE_TEXT_DEFAULTS.computeGlyphs);
    const glyphSets = $derived(characters.map((character) => Array.from(computeGlyphs(character))));

    const settleDurationMs = $derived(props.settleDurationMs ?? SCRAMBLE_TEXT_DEFAULTS.settleDurationMs);
    const initialDelayMs = $derived(props.initialDelayMs ?? NO_DELAY);
    const scrambleIntervalMs = $derived(props.scrambleIntervalMs ?? SCRAMBLE_TEXT_DEFAULTS.scrambleIntervalMs);

    const settleTimes = $derived(
        ScrambleTextUtils.getSettleTimes(
            ScrambleTextUtils.resolveWeights(characters.length, props.computeCharacterWeights?.(characters.length)),
            initialDelayMs,
            settleDurationMs,
        ),
    );
    const startTimes = $derived(ScrambleTextUtils.getStartTimes(settleTimes, props.churnDurationMs));

    const scrambler = ScrambleTextUtils.createScrambler({
        getCharacters: () => characters,
        getGlyphSets: () => glyphSets,
        getSettleTimes: () => settleTimes,
        getStartTimes: () => startTimes,
        getInitialDelayMs: () => initialDelayMs,
        getSettleDurationMs: () => settleDurationMs,
        getScrambleIntervalMs: () => scrambleIntervalMs,
        onAnimationEnd: () => props.onAnimationEnd?.(),
    });

    $effect(() => () => scrambler.stop());

    const getElapsedMs = readStore(scrambler, (value) => value.elapsedMs);
    const getNoise = readStore(scrambler, (value) => value.noise);
    const getIsScrambling = readStore(scrambler, (value) => value.isScrambling);
    const getKept = readStore(scrambler, (value) => value.kept);

    const timing = $derived({ elapsedMs: getElapsedMs(), isScrambling: getIsScrambling(), kept: getKept() });

    let previousCharacters: string[] | undefined;

    $effect(() => {
        const next = characters;

        untrack(() => {
            const previous = previousCharacters;

            previousCharacters = next;

            scrambler.start(
                previous && previous !== next && props.changedOnly
                    ? scrambler.getKeptAfterChange(previous, next)
                    : undefined,
            );
        });
    });

    const controller: ScrambleTextController = {
        restartAnimation: () => scrambler.start(),
    };

    $effect(() => {
        untrack(() => props.onMount?.(controller));
    });
</script>

{#each segments as segment, segmentIndex (segmentIndex)}
    {#if segment.isWhitespace}
        {segment.characters.join("")}
    {:else}
        <span class={styles.scrambleTextWord}>
            {#each segment.characters as character, offset (offset)}
                {@const index = segment.startIndex + offset}
                {@const isSettled = ScrambleTextUtils.getIsSettled(timing, settleTimes[index], index)}
                {@const isPending = ScrambleTextUtils.getIsPending(timing, startTimes[index])}
                <span class={styles.scrambleTextCharacter}>
                    <span class={isSettled ? undefined : styles.scrambleTextSettling}>{character}</span
                    >{#if !isSettled && !isPending}
                        <span class={styles.scrambleTextNoise} aria-hidden="true">{getNoise()[index]}</span>
                    {/if}
                </span>
            {/each}
        </span>
    {/if}
{/each}
