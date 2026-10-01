<script lang="ts">
    import { tick, untrack } from "svelte";

    import { TYPEWRITER_DEFAULTS, TypewriterUtils, TypewriterStyles as styles } from "@thewaver/ss-components";
    import { StringUtils } from "@thewaver/ss-utils";

    import { readStore } from "../../../Utils/storeUtils.js";
    import { toStyle } from "../../../Utils/styleUtils.js";
    import type { TypewriterController, TypewriterProps } from "./Typewriter.types.js";

    const BEFORE_FIRST = TypewriterUtils.CARET_BEFORE_FIRST;
    const DATA_PREFIX = "data-";

    const toDataAttributes = (dataset: DOMStringMap) =>
        Object.fromEntries(
            Object.entries(dataset).map(([key, value]) => [
                `${DATA_PREFIX}${StringUtils.camelToKebabCase(key)}`,
                value,
            ]),
        );

    let props: TypewriterProps = $props();

    const animationName = $derived(props.animationName ?? TYPEWRITER_DEFAULTS.animationName);
    const animationDurationMs = $derived(props.animationDurationMs ?? TYPEWRITER_DEFAULTS.animationDurationMs);
    const animationDelayMs = $derived(props.animationDelayMs ?? TYPEWRITER_DEFAULTS.animationDelayMs);
    const initialAnimationDelayMs = $derived(
        props.initialAnimationDelayMs ?? TYPEWRITER_DEFAULTS.initialAnimationDelayMs,
    );
    const mode = $derived(props.mode ?? TYPEWRITER_DEFAULTS.mode);
    const isErasing = $derived(mode === "erase");

    let container = $state<HTMLDivElement>();

    const player = TypewriterUtils.createPlayer({
        getContainer: () => container ?? undefined,
        getAnimationDurationMs: () => animationDurationMs,
        getAnimationDelayMs: () => animationDelayMs,
        getInitialAnimationDelayMs: () => initialAnimationDelayMs,
        getIsErasing: () => isErasing,
        getResetAnimationOnContent: () => props.resetAnimationOnContent,
        getResetAnimationOnLayout: () => props.resetAnimationOnLayout,
        onAnimationEnd: () => props.onAnimationEnd?.(),
    });

    $effect(() => () => player.stop());

    const getPlayerState = readStore(player);

    const controller: TypewriterController = {
        restartAnimation: () => {
            player.restart();

            return true;
        },
        update: (cause) => {
            if (!container) return false;

            void tick().then(() => player.update(cause));

            return true;
        },
    };

    let previousRun = untrack(() => ({ animationName, mode }));

    $effect(() => {
        const next = { animationName, mode };

        untrack(() => {
            const previous = previousRun;

            previousRun = next;

            if (previous.animationName !== next.animationName || previous.mode !== next.mode) player.restart();
        });
    });

    $effect(() => {
        const ref = container;

        return untrack(() => {
            props.onMount?.(controller);

            return ref ? player.observe(ref) : undefined;
        });
    });

    const isAnimating = $derived(getPlayerState().isAnimating);
    const caretIndex = $derived(getPlayerState().caretIndex);
    const isErased = $derived(!isAnimating && isErasing);
    const startTimesMs = $derived(
        TypewriterUtils.computeStartTimes(
            getPlayerState().count,
            props.computeCharacterWeights?.(getPlayerState().count),
            isErasing,
            initialAnimationDelayMs,
            animationDelayMs,
        ),
    );

    const getAnimationStyle = (startIndex: number) =>
        isAnimating
            ? toStyle({
                  animationName,
                  animationDuration: `${animationDurationMs}ms`,
                  animationDelay: `${startTimesMs[startIndex]}ms`,
                  animationDirection: isErasing ? "reverse" : "normal",
              })
            : undefined;

    const handleAnimationStart = (event: AnimationEvent, index: number) => {
        if (event.target !== event.currentTarget) return;

        player.reportCharacterStart(index);
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

<div class={styles.typewriterRoot}>
    <div bind:this={container} class={styles.typewriterChildrenWrap} aria-hidden="true" inert>
        {@render props.children?.()}
    </div>

    {#if getPlayerState().segments.length > 0}
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
                        onanimationstart={(event) => handleAnimationStart(event, segment.startIndex)}
                    ></span>{@render caretAfter(segment.startIndex)}
                {:else if segment.type === "linebreak"}
                    <br
                        style={getAnimationStyle(segment.startIndex)}
                        onanimationstart={(event) => handleAnimationStart(event, segment.startIndex)}
                    />{@render caretAfter(segment.startIndex)}
                {:else}
                    {@const textStyle = toStyle({ ...segment.nonMetrics, ...segment.metrics })}
                    {#if isAnimating}
                        <span style={textStyle}>
                            {#each Array.from(segment.text) as character, offset (offset)}
                                <span
                                    class={styles.typewriterChar}
                                    style={getAnimationStyle(segment.startIndex + offset)}
                                    onanimationstart={(event) =>
                                        handleAnimationStart(event, segment.startIndex + offset)}
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
