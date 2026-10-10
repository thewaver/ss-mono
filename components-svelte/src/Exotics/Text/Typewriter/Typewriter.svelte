<script lang="ts">
    import { tick, untrack } from "svelte";

    import {
        LetterDriverStyles,
        LetterDriverUtils,
        type LetterState,
        TYPEWRITER_DEFAULTS,
        TypewriterUtils,
        TypewriterStyles as styles,
    } from "@thewaver/ss-components";
    import { StringUtils } from "@thewaver/ss-utils";
    import { assignInlineVars } from "@vanilla-extract/dynamic";

    import { setLetterDriverContext } from "../../../Abstracts/LetterDriver/LetterDriver.context.js";
    import { watchChange } from "../../../Utils/effectUtils.svelte.js";
    import { readStore } from "../../../Utils/storeUtils.js";
    import { toStyle } from "../../../Utils/styleUtils.js";
    import type { TypewriterController, TypewriterProps } from "./Typewriter.types.js";

    const BEFORE_FIRST = TypewriterUtils.CARET_BEFORE_FIRST;
    const NO_PROGRESS = 0;
    const DATA_PREFIX = "data-";

    const toDataAttributes = (dataset: DOMStringMap) =>
        Object.fromEntries(
            Object.entries(dataset).map(([key, value]) => [
                `${DATA_PREFIX}${StringUtils.camelToKebabCase(key)}`,
                value,
            ]),
        );

    let { progress = $bindable(NO_PROGRESS), playback = $bindable(true), ...props }: TypewriterProps = $props();

    const computeAnimationName = $derived(props.computeAnimationName ?? TYPEWRITER_DEFAULTS.computeAnimationName);
    const animationDurationMs = $derived(props.animationDurationMs ?? TYPEWRITER_DEFAULTS.animationDurationMs);
    const animationDelayMs = $derived(props.animationDelayMs ?? TYPEWRITER_DEFAULTS.animationDelayMs);
    const initialAnimationDelayMs = $derived(
        props.initialAnimationDelayMs ?? TYPEWRITER_DEFAULTS.initialAnimationDelayMs,
    );
    const mode = $derived(props.mode ?? TYPEWRITER_DEFAULTS.mode);
    const isErasing = $derived(mode === "erase");

    let container = $state<HTMLDivElement>();

    const registry = LetterDriverUtils.createRegistry();
    const getRegistryState = readStore(registry);
    const isDriven = $derived(getRegistryState().entries.length > 0);

    const setProgress = (value: number) => {
        progress = value;
    };

    const player = TypewriterUtils.createPlayer({
        getContainer: () => container ?? undefined,
        getComputeAnimationName: () => untrack(() => computeAnimationName),
        getIsDriven: () => isDriven,
        getIsPlaying: () => untrack(() => playback),
        setProgress,
        getResetAnimationOnContent: () => props.resetAnimationOnContent,
        getResetAnimationOnLayout: () => props.resetAnimationOnLayout,
    });

    const getPlayerState = readStore(player);
    const getSegments = readStore(player, (state) => state.segments);
    const getDrivenCharacters = readStore(registry, (state) => state.characters);

    const count = $derived(getPlayerState().count);
    const runDurationMs = $derived(
        TypewriterUtils.getRunDurationMs(count, animationDelayMs, initialAnimationDelayMs, animationDurationMs),
    );
    const timeMs = $derived(progress * runDurationMs);
    const isAnimating = $derived(TypewriterUtils.getIsRunning(count, progress, playback));
    const isErased = $derived(!isAnimating && isErasing);
    const startTimesMs = $derived(
        TypewriterUtils.computeStartTimes(
            count,
            props.computeCharacterWeights?.(count),
            isErasing,
            initialAnimationDelayMs,
            animationDelayMs,
        ),
    );
    const characters = $derived(
        isDriven ? getDrivenCharacters() : LetterDriverUtils.getCharacters(getSegments()),
    );
    const animationNames = $derived(
        characters.map((character, index) => computeAnimationName(character, index, characters.length)),
    );
    const hangingIndices = $derived(LetterDriverUtils.getHangingIndices(getSegments()));
    const caretIndex = $derived(
        TypewriterUtils.computeCaretIndex(startTimesMs, timeMs, isErasing, !isAnimating, hangingIndices),
    );

    const controller: TypewriterController = {
        restartAnimation: () => {
            playback = true;
            player.restart();

            return true;
        },
        update: (cause) => {
            if (!container) return false;

            void tick().then(() => player.update(cause));

            return true;
        },
    };

    let namedCharacters = untrack(() => characters);

    watchChange(
        () => animationNames,
        (names, previous) => {
            const isRenamed =
                names.length !== previous.length || names.some((name, index) => name !== previous[index]);

            if (characters === namedCharacters && isRenamed) player.restart();

            namedCharacters = characters;
        },
    );

    watchChange(
        () => mode,
        () => player.restart(),
    );

    $effect(() => {
        const ref = container;

        return untrack(() => {
            props.onMount?.(controller);

            return ref ? player.observe(ref) : undefined;
        });
    });

    let previousDrivenCount = 0;

    $effect(() => {
        const drivenCharacters = getDrivenCharacters();
        const driven = isDriven;

        untrack(() => {
            if (!driven) return;

            player.setCount(drivenCharacters.length, previousDrivenCount ? "content" : "other");
            previousDrivenCount = drivenCharacters.length;
        });
    });

    $effect(() => {
        if (!playback || !isAnimating) return;

        return untrack(() =>
            TypewriterUtils.run({
                getProgress: () => progress,
                setProgress,
                getRunDurationMs: () => runDurationMs,
                onEnd: () => props.onAnimationEnd?.(),
            }),
        );
    });

    const computeLetterAnimation = (index: number) => ({
        name: animationNames[index],
        durationMs: animationDurationMs,
        delayMs: startTimesMs[index],
        direction: isErasing ? ("reverse" as const) : ("normal" as const),
    });

    const getLetterState = (index: number): LetterState =>
        isAnimating ? { isHidden: false, animation: computeLetterAnimation(index) } : { isHidden: isErased };

    setLetterDriverContext({
        registry,
        getLetterState,
        getIsAnimating: () => isAnimating,
        getIsHidden: () => isErased,
        getCaretIndex: () => caretIndex,
        get renderCaret() {
            return props.renderCaret;
        },
    });

    const getAnimationStyle = (index: number) =>
        isAnimating
            ? toStyle(
                  LetterDriverUtils.computeAnimationStyle(
                      computeLetterAnimation(index),
                      LetterDriverStyles.letterDriverTimeVar,
                  ),
              )
            : undefined;

    const attachTimeVar = (node: HTMLElement) => {
        const vars = assignInlineVars({
            [LetterDriverStyles.letterDriverTimeVar]: LetterDriverUtils.getTimeValue(timeMs),
        });

        for (const [name, value] of Object.entries(vars)) node.style.setProperty(name, value);
    };

    const attachAtomic = (element: HTMLElement) => (node: HTMLElement) => {
        if (node.firstChild !== element) node.replaceChildren(element);
    };
</script>

{#snippet caretAfter(index: number)}
    {#if isAnimating && caretIndex === index}
        {@render props.renderCaret?.()}
    {/if}
{/snippet}

<div {@attach attachTimeVar} class={styles.typewriterRoot}>
    <div
        bind:this={container}
        class={isDriven ? undefined : styles.typewriterChildrenWrap}
        aria-hidden={isDriven ? undefined : "true"}
        inert={!isDriven}
    >
        {@render props.children?.()}
    </div>

    {#if !isDriven && getPlayerState().segments.length > 0}
        <div class={styles.typewriterTextWrap} style:width={`${getPlayerState().width ?? 0}px`}>
            {#if caretIndex === BEFORE_FIRST}
                {@render props.renderCaret?.()}
            {/if}{#each getPlayerState().segments as segment, index (index)}
                {#if segment.type === "atomic"}
                    <span
                        {@attach attachAtomic(segment.element)}
                        class={[
                            segment.isBlockLike ? styles.typewriterBlockLikeAtomic : styles.typewriterChar,
                            isErased && styles.typewriterErased,
                        ]}
                        style={getAnimationStyle(segment.startIndex)}
                    ></span>{@render caretAfter(segment.startIndex)}
                {:else if segment.type === "linebreak"}
                    {#if LetterDriverUtils.getIsAnimated(segment)}
                        <br style={getAnimationStyle(segment.startIndex)} />{@render caretAfter(segment.startIndex)}
                    {:else}
                        <br />
                    {/if}
                {:else}
                    {@const textStyle = toStyle({ ...segment.nonMetrics, ...segment.metrics })}
                    {#if isAnimating}
                        <span style={textStyle}>
                            {#each Array.from(segment.text) as character, offset (offset)}
                                <span
                                    class={styles.typewriterChar}
                                    style={getAnimationStyle(segment.startIndex + offset)}
                                >{character}</span>{@render caretAfter(segment.startIndex + offset)}
                            {/each}
                        </span>
                    {:else if segment.meta?.anchor}
                        <a
                            class={[styles.typewriterChar, isErased && styles.typewriterErased]}
                            style={textStyle}
                            title={segment.meta?.common.title}
                            {...toDataAttributes(segment.meta?.common.dataset ?? {})}
                            {...segment.meta.anchor}
                        >{segment.text}</a>
                    {:else}
                        <span
                            class={[styles.typewriterChar, isErased && styles.typewriterErased]}
                            style={textStyle}
                            title={segment.meta?.common.title}
                            {...toDataAttributes(segment.meta?.common.dataset ?? {})}
                        >{segment.text}</span>
                    {/if}
                {/if}
            {/each}{#if !isAnimating && caretIndex !== BEFORE_FIRST}
                {@render props.renderCaret?.()}
            {/if}
        </div>
    {/if}
</div>
