<script lang="ts">
    import { tick, untrack } from "svelte";

    import {
        LetterDriverStyles,
        LetterDriverUtils,
        PAINTED_TEXT_DEFAULTS,
        PaintedTextUtils,
        ShapeLayerUtils,
        TrailUtils,
        PaintedTextStyles as styles,
    } from "@thewaver/ss-components";

    import { InteractionTrackerSvelteUtils } from "../../../Abstracts/InteractionTracker/InteractionTrackerSvelte.utils.svelte.js";
    import { getLetterDriverContext } from "../../../Abstracts/LetterDriver/LetterDriver.context.js";
    import PaintAreaProvider from "../../../Generators/SVGDefs/SVGGradients/PaintAreaProvider.svelte";
    import Markup from "../../../Utils/Markup.svelte";
    import { readStore } from "../../../Utils/storeUtils.js";
    import { toStyle } from "../../../Utils/styleUtils.js";
    import type { PaintedTextController, PaintedTextProps } from "./PaintedText.types.js";

    const MASK_PADDING_SIDES = 2;
    const NO_OFFSET = 0;
    const NO_LENGTH = 0;
    const NO_PROGRESS = 0;

    let {
        progress = $bindable(NO_PROGRESS),
        playback = $bindable(PAINTED_TEXT_DEFAULTS.playback),
        ...props
    }: PaintedTextProps = $props();

    const uid = $props.id();
    const maskId = `painted-text-mask-${uid}`;
    const pathId = `painted-text-path-${uid}`;

    const getIsPageHidden = InteractionTrackerSvelteUtils.trackPageHidden();

    const isOnPath = $derived(props.path !== undefined);
    const isFittedToPath = $derived(props.isFittedToPath ?? PAINTED_TEXT_DEFAULTS.isFittedToPath);
    const lapDurationMs = $derived(props.lapDurationMs ?? PAINTED_TEXT_DEFAULTS.lapDurationMs);

    const driver = getLetterDriverContext();

    let root = $state<HTMLDivElement>();
    let source = $state<HTMLDivElement>();
    let layoutHost = $state<HTMLDivElement>();

    const getComputePushingAnimationName = () => {
        const computeName = driver?.getComputePushingAnimationName?.();

        if (!computeName || !driver) return undefined;

        return (character: string, index: number) =>
            computeName(character, offset + index, driver.registry.get().characters.length);
    };

    const layout = PaintedTextUtils.createLayout({
        getSource: () => source ?? undefined,
        getLayoutHost: () => layoutHost ?? undefined,
        getIsMeasuringLetters: () => !!driver,
        getComputePushingAnimationName: () => untrack(getComputePushingAnimationName),
        getPath: () => untrack(() => props.path),
        getIsFittedToPath: () => untrack(() => isFittedToPath),
    });

    const getLayoutState = readStore(layout);
    const getRestLetters = readStore(layout, (state) => state.restLetters);
    const getOrigin = readStore(layout, (state) => state.origin);
    const getRegistryState = readStore(driver?.registry ?? LetterDriverUtils.createRegistry());

    const controller: PaintedTextController = {
        update: () => {
            if (!source) return false;

            void tick().then(() => layout.update());

            return true;
        },
    };

    $effect(() => {
        const element = source;

        return untrack(() => {
            props.onMount?.(controller);

            return element ? layout.observe(element) : undefined;
        });
    });

    let registration = $state<ReturnType<NonNullable<typeof driver>["registry"]["register"]>>();

    $effect(() => {
        const element = root;

        if (!driver || !element) return;

        return untrack(() => {
            const next = driver.registry.register(element);

            registration = next;

            return () => {
                registration = undefined;
                next.unregister();
            };
        });
    });

    $effect(() => {
        const letters = getLayoutState().letters;

        registration?.setCharacters(letters.map((letter) => letter.character));
    });

    $effect(() => {
        const letters = getRestLetters();
        const letterOrigin = getOrigin();

        registration?.setBoxes(
            letters.map((letter) => ({
                x: letter.x - letterOrigin.x,
                y: letter.top - letterOrigin.y,
                width: letter.width,
                height: letter.height,
            })),
        );
    });

    const width = $derived(getLayoutState().width ?? 0);
    const height = $derived(getLayoutState().height);
    const origin = $derived(getOrigin());
    const pathLength = $derived(getLayoutState().pathLength);
    const startOffset = $derived(progress * pathLength);
    const isSliding = $derived(isOnPath && playback && !getIsPageHidden() && pathLength > NO_LENGTH);

    $effect(() => {
        void props.path;
        void isFittedToPath;

        untrack(() => layout.update());
    });

    $effect(() => {
        const slideOffset = startOffset;

        untrack(() => layout.placeAlongPath(slideOffset));
    });

    $effect(() => {
        if (!isSliding) return;

        return untrack(() =>
            TrailUtils.run({
                getProgress: () => progress,
                setProgress: (value) => {
                    progress = value;
                },
                getRunDurationMs: () => lapDurationMs,
                getIsLooping: () => true,
                onEnd: () => undefined,
            }),
        );
    });
    const size = $derived({ width, height });
    const strokePaint = $derived(
        PaintedTextUtils.computeStrokePaint(
            props.strokeAlignment ?? PAINTED_TEXT_DEFAULTS.strokeAlignment,
            props.strokeWidth ?? PAINTED_TEXT_DEFAULTS.strokeWidth,
        ),
    );
    const strokeDefs = $derived(props.computeStrokeDefs?.(size, root ?? undefined) ?? []);
    const fillDefs = $derived(
        PaintedTextUtils.resolveFillDefs(props.computeFillDefs?.(size, root ?? undefined), strokeDefs),
    );
    const maskPadding = $derived(strokePaint.drawnWidth);

    const offset = $derived.by(() => {
        getRegistryState();

        return driver && root ? driver.registry.getOffset(root) : NO_OFFSET;
    });

    const isPerLetter = $derived(!!driver?.getIsAnimating());

    $effect(() => {
        if (!driver?.getComputePushingAnimationName) return;

        const letterOffset = offset;
        const letterStyles = getRestLetters().map((_, index) => {
            const animation = driver.getLetterState(letterOffset + index).animation;

            return animation
                ? LetterDriverUtils.computeAnimationStyle(animation, LetterDriverStyles.letterDriverTimeVar)
                : undefined;
        });

        layout.relayout(letterStyles);
    });

    const getLetterStyle = (localIndex: number) =>
        driver && isPerLetter
            ? PaintedTextUtils.computeLetterStyle(
                  driver.getLetterState(offset + localIndex),
                  LetterDriverStyles.letterDriverTimeVar,
              )
            : undefined;

    const atomicLetterIndices = $derived(
        getLayoutState().letters.reduce<number[]>((indices, letter, index) => {
            if (letter.atomicIndex !== undefined) indices[letter.atomicIndex] = index;

            return indices;
        }, []),
    );

    const caretBox = $derived.by(() => {
        const caretIndex = driver?.getCaretIndex?.();
        const layoutState = getLayoutState();

        if (!driver?.renderCaret || caretIndex === undefined) return undefined;

        return PaintedTextUtils.computeCaretBox(
            layoutState.letters,
            caretIndex,
            offset,
            isOnPath ? { ascent: layoutState.ascent, descent: layoutState.descent } : undefined,
        );
    });

    const attachAtomic = (element: SVGElement) => (node: SVGGElement) => {
        if (node.firstChild !== element) node.replaceChildren(element);
    };
</script>

{#snippet runs(isReadable: boolean)}
    {#each getLayoutState().runs as run, index (index)}
        <tspan x={isOnPath ? undefined : run.x} y={isOnPath ? undefined : run.y} style={toStyle(run.style)}
            >{#if isReadable && run.title}<title>{run.title}</title>{/if}{#if isReadable && run.anchor}<a
                    href={run.anchor.href}
                    target={run.anchor.target}
                    rel={run.anchor.rel}>{run.text}</a
                >{:else}{run.text}{/if}</tspan
        >
    {/each}
{/snippet}

{#snippet letters()}
    {#each getLayoutState().letters as letter, index (index)}
        {#if letter.kind === "text"}
            {@const letterState = driver?.getLetterState(offset + index)}
            <text
                class={styles.paintedTextLayer}
                x={letterState?.glyph ? letter.x + letter.width * 0.5 : letter.x}
                y={letter.baseline}
                text-anchor={letterState?.glyph ? "middle" : undefined}
                style={toStyle({ ...getLayoutState().runs[letter.runIndex ?? 0]?.style, ...getLetterStyle(index) })}
                >{letterState?.glyph ?? letter.character}</text
            >
        {/if}
    {/each}
{/snippet}

{#snippet pathLetters()}
    {#each getLayoutState().letters as letter, index (index)}
        {#if letter.placement}
            {@const placement = letter.placement}
            {@const letterState = driver?.getLetterState(offset + index)}
            <g transform={`translate(${placement.point.x} ${placement.point.y}) rotate(${placement.angle})`}>
                <text
                    class={styles.paintedTextLayer}
                    x={letterState?.glyph ? 0 : -placement.advance * 0.5}
                    y={0}
                    text-anchor={letterState?.glyph ? "middle" : undefined}
                    style={toStyle({
                        ...getLayoutState().runs[letter.runIndex ?? 0]?.style,
                        ...getLetterStyle(index),
                    })}>{letterState?.glyph ?? letter.character}</text
                >
            </g>
        {/if}
    {/each}
{/snippet}

{#snippet pathText(attributes: Record<string, unknown>, isReadable: boolean, textOffset: number)}
    <text
        class={styles.paintedTextLayer}
        {...attributes}
        textLength={isFittedToPath ? pathLength : undefined}
        lengthAdjust={isFittedToPath ? "spacing" : undefined}
        aria-hidden={isReadable ? undefined : "true"}
    >
        <textPath href={`#${pathId}`} startOffset={textOffset}>{@render runs(isReadable)}</textPath>
    </text>
{/snippet}

{#snippet layer(attributes: Record<string, unknown>, isReadable: boolean)}
    {#if isPerLetter}
        <g {...attributes} aria-hidden="true">
            {#if isOnPath}
                {@render pathLetters()}
            {:else}
                {@render letters()}
            {/if}
        </g>
    {:else if isOnPath}
        {@render pathText(attributes, isReadable, startOffset)}
    {:else}
        <text class={styles.paintedTextLayer} {...attributes} aria-hidden={isReadable ? undefined : "true"}>
            {@render runs(isReadable)}
        </text>
    {/if}
{/snippet}

<div
    bind:this={root}
    class={styles.paintedTextRoot}
    style:width={isOnPath ? `${width}px` : undefined}
    style:height={isOnPath ? `${height}px` : undefined}
>
    <div bind:this={source} class={styles.paintedTextSourceWrap} aria-hidden="true" inert>
        {@render props.children?.()}
    </div>

    <div
        bind:this={layoutHost}
        class={[styles.paintedTextLayoutWrap, isOnPath && styles.paintedTextLayoutWrapOnPath]}
        aria-hidden="true"
        inert
    ></div>

    <svg
        class={styles.paintedTextSVG}
        {width}
        {height}
        viewBox={`${origin.x} ${origin.y} ${width} ${height}`}
        style:visibility={driver?.getIsHidden() ? "hidden" : undefined}
    >
        <defs>
            <PaintAreaProvider getPaintArea={() => ({ ...origin, width, height })}>
                {#each [...fillDefs, ...strokeDefs] as def, index (index)}
                    <Markup markup={def.gradientOrPattern?.renderDefsElement()} />
                    <Markup markup={def.filter?.renderDefsElement()} />
                    <Markup markup={def.clipPath?.renderDefsElement()} />
                {/each}
            </PaintAreaProvider>

            {#if isOnPath}
                <path id={pathId} d={PaintedTextUtils.computeLapPath(props.path ?? "")} />
            {/if}

            {#if strokePaint.maskKind}
                <mask
                    id={maskId}
                    maskUnits="userSpaceOnUse"
                    x={origin.x - maskPadding}
                    y={origin.y - maskPadding}
                    width={width + maskPadding * MASK_PADDING_SIDES}
                    height={height + maskPadding * MASK_PADDING_SIDES}
                >
                    {#if strokePaint.maskKind === "outside"}
                        <rect
                            x={origin.x - maskPadding}
                            y={origin.y - maskPadding}
                            width={width + maskPadding * MASK_PADDING_SIDES}
                            height={height + maskPadding * MASK_PADDING_SIDES}
                            fill="white"
                        />
                    {/if}

                    {@render layer({ fill: strokePaint.maskKind === "outside" ? "black" : "white" }, false)}
                </mask>
            {/if}
        </defs>

        {#if isPerLetter}
            {#if isOnPath}
                {@render pathText({ opacity: 0 }, true, startOffset)}
            {:else}
                <text class={styles.paintedTextLayer} opacity={0}>
                    {@render runs(true)}
                </text>
            {/if}
        {/if}

        {#each fillDefs as def, index (index)}
            {@const paint = ShapeLayerUtils.computePaint(def)}
            {@render layer(
                {
                    "fill": paint.fill,
                    "fill-opacity": paint.fillOpacity,
                    "filter": paint.filter,
                    "clip-path": paint.clipPath,
                    "style": paint.mixBlendMode ? `mix-blend-mode: ${paint.mixBlendMode}` : undefined,
                },
                PaintedTextUtils.getIsReadableLayer("fill", index, fillDefs.length),
            )}
        {/each}

        {#each strokeDefs as def, index (index)}
            {@const paint = ShapeLayerUtils.computePaint(def)}
            {@render layer(
                {
                    "fill": "none",
                    "stroke": paint.fill,
                    "stroke-opacity": paint.fillOpacity,
                    "stroke-width": strokePaint.drawnWidth,
                    "stroke-linejoin": "round",
                    "mask": strokePaint.maskKind ? `url(#${maskId})` : undefined,
                    "filter": paint.filter,
                    "clip-path": paint.clipPath,
                    "style": paint.mixBlendMode ? `mix-blend-mode: ${paint.mixBlendMode}` : undefined,
                },
                PaintedTextUtils.getIsReadableLayer("stroke", index, fillDefs.length),
            )}
        {/each}

        {#each getLayoutState().atomics as node, index (index)}
            <g style={toStyle(getLetterStyle(atomicLetterIndices[index]))} {@attach attachAtomic(node)}></g>
        {/each}
    </svg>

    {#if caretBox}
        {#key caretBox}
            <div class={styles.paintedTextCaret} style={toStyle(PaintedTextUtils.computeCaretStyle(caretBox, origin))}>
                {@render driver?.renderCaret?.()}
            </div>
        {/key}
    {/if}
</div>
