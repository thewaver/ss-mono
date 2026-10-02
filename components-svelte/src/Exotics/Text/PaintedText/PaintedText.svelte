<script lang="ts">
    import { tick, untrack } from "svelte";

    import {
        LetterDriverUtils,
        PAINTED_TEXT_DEFAULTS,
        PaintedTextUtils,
        ShapeLayerUtils,
        PaintedTextStyles as styles,
    } from "@thewaver/ss-components";

    import { getLetterDriverContext } from "../../../Abstracts/LetterDriver/LetterDriver.context.js";
    import PaintAreaProvider from "../../../Generators/SVGDefs/SVGGradients/PaintAreaProvider.svelte";
    import Markup from "../../../Utils/Markup.svelte";
    import { readStore } from "../../../Utils/storeUtils.js";
    import { toStyle } from "../../../Utils/styleUtils.js";
    import type { PaintedTextController, PaintedTextProps } from "./PaintedText.types.js";

    const MASK_PADDING_SIDES = 2;
    const NO_OFFSET = 0;
    const BEFORE_FIRST = -1;

    let props: PaintedTextProps = $props();

    const uid = $props.id();
    const maskId = `painted-text-mask-${uid}`;

    const driver = getLetterDriverContext();

    let root = $state<HTMLDivElement>();
    let source = $state<HTMLDivElement>();
    let layoutHost = $state<HTMLDivElement>();

    const layout = PaintedTextUtils.createLayout({
        getSource: () => source ?? undefined,
        getLayoutHost: () => layoutHost ?? undefined,
        getIsMeasuringLetters: () => !!driver,
    });

    const getLayoutState = readStore(layout);
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

    const width = $derived(getLayoutState().width ?? 0);
    const height = $derived(getLayoutState().height);
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

    const getLetterStyle = (localIndex: number) =>
        driver && isPerLetter
            ? PaintedTextUtils.computeLetterStyle(driver.getLetterState(offset + localIndex))
            : undefined;

    const atomicLetterIndices = $derived(
        getLayoutState().letters.reduce<number[]>((indices, letter, index) => {
            if (letter.atomicIndex !== undefined) indices[letter.atomicIndex] = index;

            return indices;
        }, []),
    );

    const caretBox = $derived.by(() => {
        const caretIndex = driver?.getCaretIndex?.();
        const letters = getLayoutState().letters;

        if (!driver?.renderCaret || caretIndex === undefined) return undefined;

        if (caretIndex === BEFORE_FIRST) {
            const first = letters[0];

            return offset === NO_OFFSET && first ? { x: first.x, top: first.top, height: first.height } : undefined;
        }

        const letter = letters[caretIndex - offset];

        return letter ? { x: letter.x + letter.width, top: letter.top, height: letter.height } : undefined;
    });

    const reportStart = (event: AnimationEvent, localIndex: number) => {
        if (event.target === event.currentTarget) driver?.reportLetterStart?.(offset + localIndex);
    };

    const attachAtomic = (element: SVGElement) => (node: SVGGElement) => {
        if (node.firstChild !== element) node.replaceChildren(element);
    };
</script>

{#snippet runs(isReadable: boolean)}
    {#each getLayoutState().runs as run, index (index)}
        <tspan x={run.x} y={run.y} style={toStyle(run.style)}
            >{#if isReadable && run.title}<title>{run.title}</title>{/if}{#if isReadable && run.anchor}<a
                    href={run.anchor.href}
                    target={run.anchor.target}
                    rel={run.anchor.rel}>{run.text}</a
                >{:else}{run.text}{/if}</tspan
        >
    {/each}
{/snippet}

{#snippet letters(isReporting: boolean)}
    {#each getLayoutState().letters as letter, index (index)}
        {#if letter.kind === "text"}
            {@const letterState = driver?.getLetterState(offset + index)}
            <text
                class={styles.paintedTextLayer}
                x={letterState?.glyph ? letter.x + letter.width * 0.5 : letter.x}
                y={letter.baseline}
                text-anchor={letterState?.glyph ? "middle" : undefined}
                style={toStyle({ ...getLayoutState().runs[letter.runIndex ?? 0]?.style, ...getLetterStyle(index) })}
                onanimationstart={isReporting ? (event) => reportStart(event, index) : undefined}
                >{letterState?.glyph ?? letter.character}</text
            >
        {/if}
    {/each}
{/snippet}

{#snippet layer(attributes: Record<string, unknown>, isReadable: boolean)}
    {#if isPerLetter}
        <g {...attributes} aria-hidden="true">
            {@render letters(isReadable)}
        </g>
    {:else}
        <text class={styles.paintedTextLayer} {...attributes} aria-hidden={isReadable ? undefined : "true"}>
            {@render runs(isReadable)}
        </text>
    {/if}
{/snippet}

<div bind:this={root} class={styles.paintedTextRoot}>
    <div bind:this={source} class={styles.paintedTextSourceWrap} aria-hidden="true" inert>
        {@render props.children?.()}
    </div>

    <div bind:this={layoutHost} class={styles.paintedTextLayoutWrap} aria-hidden="true" inert></div>

    <svg
        class={styles.paintedTextSVG}
        {width}
        {height}
        viewBox={`0 0 ${width} ${height}`}
        style:visibility={driver?.getIsHidden() ? "hidden" : undefined}
    >
        <defs>
            <PaintAreaProvider getPaintArea={() => ({ x: 0, y: 0, width, height })}>
                {#each [...fillDefs, ...strokeDefs] as def, index (index)}
                    <Markup markup={def.gradientOrPattern?.renderDefsElement()} />
                    <Markup markup={def.filter?.renderDefsElement()} />
                    <Markup markup={def.clipPath?.renderDefsElement()} />
                {/each}
            </PaintAreaProvider>

            {#if strokePaint.maskKind}
                <mask
                    id={maskId}
                    maskUnits="userSpaceOnUse"
                    x={-maskPadding}
                    y={-maskPadding}
                    width={width + maskPadding * MASK_PADDING_SIDES}
                    height={height + maskPadding * MASK_PADDING_SIDES}
                >
                    {#if strokePaint.maskKind === "outside"}
                        <rect
                            x={-maskPadding}
                            y={-maskPadding}
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
            <text class={styles.paintedTextLayer} opacity={0}>
                {@render runs(true)}
            </text>
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
            <div
                class={styles.paintedTextCaret}
                style:left={`${caretBox.x}px`}
                style:top={`${caretBox.top}px`}
                style:height={`${caretBox.height}px`}
            >
                {@render driver?.renderCaret?.()}
            </div>
        {/key}
    {/if}
</div>
