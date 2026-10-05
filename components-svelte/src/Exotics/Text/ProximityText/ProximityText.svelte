<script lang="ts">
    import { untrack } from "svelte";

    import {
        LetterDriverStyles,
        LetterDriverUtils,
        type LetterSegment,
        type LetterState,
        PROXIMITY_TEXT_DEFAULTS,
        ProximityTextUtils,
        ViewportUtils,
        ProximityTextStyles as styles,
    } from "@thewaver/ss-components";
    import { type Rect, StringUtils } from "@thewaver/ss-utils";
    import { assignInlineVars } from "@vanilla-extract/dynamic";

    import { ElementObserverSvelteUtils } from "../../../Abstracts/ElementObserver/ElementObserverSvelte.utils.svelte.js";
    import { setLetterDriverContext } from "../../../Abstracts/LetterDriver/LetterDriver.context.js";
    import { PointerTrackerSvelteUtils } from "../../../Abstracts/PointerTracker/PointerTrackerSvelte.utils.svelte.js";
    import { getViewportContext } from "../../../Abstracts/Viewport/Viewport.context.js";
    import { watchChange } from "../../../Utils/effectUtils.svelte.js";
    import { readStore } from "../../../Utils/storeUtils.js";
    import { toStyle } from "../../../Utils/styleUtils.js";
    import type { ProximityTextProps } from "./ProximityText.types.js";

    const RESTING_STRENGTH = 0;
    const NO_TIME = 0;
    const DATA_PREFIX = "data-";

    const ROOT_STYLE = toStyle(
        assignInlineVars({ [LetterDriverStyles.letterDriverTimeVar]: LetterDriverUtils.getTimeValue(NO_TIME) }),
    );

    const toDataAttributes = (dataset: DOMStringMap) =>
        Object.fromEntries(
            Object.entries(dataset).map(([key, value]) => [
                `${DATA_PREFIX}${StringUtils.camelToKebabCase(key)}`,
                value,
            ]),
        );

    let props: ProximityTextProps = $props();

    const viewportContext = getViewportContext();

    let root = $state<HTMLDivElement>();
    let container = $state<HTMLDivElement>();
    let rest = $state<HTMLDivElement>();
    let restBoxes = $state.raw<Rect[]>([]);

    const restLetterRefs: (HTMLElement | undefined)[] = [];

    const computeAnimationName = $derived(props.computeAnimationName ?? PROXIMITY_TEXT_DEFAULTS.computeAnimationName);
    const reachPx = $derived(props.reachPx ?? PROXIMITY_TEXT_DEFAULTS.reachPx);
    const isDisabled = $derived(props.isDisabled ?? false);
    const distanceAxis = $derived(props.distanceAxis ?? PROXIMITY_TEXT_DEFAULTS.distanceAxis);

    const registry = LetterDriverUtils.createRegistry();
    const getIsDriven = readStore(registry, (state) => state.entries.length > 0);
    const getDrivenCharacters = readStore(registry, (state) => state.characters);
    const getDrivenEntries = readStore(registry, (state) => state.entries);

    const layout = ProximityTextUtils.createLayout({
        getContainer: () => container ?? undefined,
        getComputeAnimationName: () => untrack(() => computeAnimationName),
        getIsDriven,
    });

    const getSegments = readStore(layout, (state) => state.segments);
    const getWidth = readStore(layout, (state) => state.width);

    const pointer = PointerTrackerSvelteUtils.create(
        () => root ?? undefined,
        () => isDisabled,
        () => props.pointSource,
    );

    const getSize = ElementObserverSvelteUtils.createBorderBoxSizeObserver(() => root ?? undefined);

    const characters = $derived(
        getIsDriven() ? getDrivenCharacters() : LetterDriverUtils.getCharacters(getSegments()),
    );
    const animationNames = $derived(
        characters.map((character, index) => computeAnimationName(character, index, characters.length)),
    );
    const drivenBoxes = $derived.by(() => {
        const element = root;

        getSize();

        if (!element) return [];

        const rootRect = ViewportUtils.getAdjustedBoundingClientRect(element, viewportContext);

        return getDrivenEntries().flatMap((entry) => {
            const entryRect = ViewportUtils.getAdjustedBoundingClientRect(entry.element, viewportContext);
            const dx = entryRect.x - rootRect.x;
            const dy = entryRect.y - rootRect.y;

            return entry.boxes.map((box) => ({ ...box, x: box.x + dx, y: box.y + dy }));
        });
    });
    const strengths = $derived(
        ProximityTextUtils.computeStrengths(
            getIsDriven() ? drivenBoxes : restBoxes,
            ProximityTextUtils.toPoint(
                pointer.getReading(),
                pointer.getIsPointerPresent() && !isDisabled,
                getSize(),
            ),
            reachPx,
            distanceAxis,
        ),
    );

    const getLetterStyle = (index: number, isResting: boolean) =>
        LetterDriverUtils.computeAnimationStyle(
            ProximityTextUtils.toLetterAnimation(
                animationNames[index],
                isResting ? RESTING_STRENGTH : (strengths[index] ?? RESTING_STRENGTH),
            ),
            LetterDriverStyles.letterDriverTimeVar,
        );

    const measureRest = () => {
        restBoxes = restLetterRefs
            .slice(0, untrack(() => characters).length)
            .map((element) =>
                element
                    ? {
                          x: element.offsetLeft,
                          y: element.offsetTop,
                          width: element.offsetWidth,
                          height: element.offsetHeight,
                      }
                    : { x: 0, y: 0, width: 0, height: 0 },
            );
    };

    $effect(() => {
        const element = rest;

        if (!element) return;

        const observer = new ResizeObserver(measureRest);

        observer.observe(element);

        return () => observer.disconnect();
    });

    watchChange(getSegments, () => queueMicrotask(measureRest));

    watchChange(
        () => computeAnimationName,
        () => layout.update(true),
    );

    $effect(() => {
        const ref = container;

        return untrack(() => (ref ? layout.observe(ref) : undefined));
    });

    const getLetterState = (index: number): LetterState => ({
        isHidden: false,
        animation: ProximityTextUtils.toLetterAnimation(animationNames[index], strengths[index] ?? RESTING_STRENGTH),
    });

    setLetterDriverContext({
        registry,
        getLetterState,
        getIsAnimating: () => true,
        getIsHidden: () => false,
        getComputePushingAnimationName: () => computeAnimationName,
    });

    const attachRest = (index: number) => (element: HTMLElement) => {
        restLetterRefs[index] = element;

        return () => {
            if (restLetterRefs[index] === element) restLetterRefs[index] = undefined;
        };
    };

    const attachAtomic = (element: HTMLElement) => (node: HTMLElement) => {
        if (node.firstChild !== element) node.replaceChildren(element);
    };
</script>

{#snippet letters(segment: LetterSegment & { type: "text" }, isResting: boolean)}
    {#each Array.from(segment.text) as character, offset (offset)}
        <span
            {@attach isResting && attachRest(segment.startIndex + offset)}
            class={styles.proximityTextLetter}
            style={toStyle(getLetterStyle(segment.startIndex + offset, isResting))}>{character}</span
        >
    {/each}
{/snippet}

{#snippet segmentView(segment: LetterSegment, isResting: boolean)}
    {#if segment.type === "atomic"}
        <span
            {@attach isResting ? attachRest(segment.startIndex) : attachAtomic(segment.element)}
            class={segment.isBlockLike ? styles.proximityTextBlockLikeAtomic : styles.proximityTextLetter}
            style={toStyle(
                getLetterStyle(segment.startIndex, isResting),
                isResting ? { width: `${segment.width}px`, height: `${segment.height}px` } : undefined,
            )}
        ></span>
    {:else if segment.type === "linebreak"}
        <br {@attach isResting && LetterDriverUtils.getIsAnimated(segment) && attachRest(segment.startIndex)} />
    {:else}
        {@const textStyle = toStyle({ ...segment.nonMetrics, ...segment.metrics })}
        {#if !isResting && segment.meta?.anchor}
            <a
                style={textStyle}
                title={segment.meta?.common.title}
                {...toDataAttributes(segment.meta?.common.dataset ?? {})}
                {...segment.meta.anchor}>{@render letters(segment, isResting)}</a
            >
        {:else if isResting}
            <span style={textStyle}>{@render letters(segment, isResting)}</span>
        {:else}
            <span
                style={textStyle}
                title={segment.meta?.common.title}
                {...toDataAttributes(segment.meta?.common.dataset ?? {})}>{@render letters(segment, isResting)}</span
            >
        {/if}
    {/if}
{/snippet}

<div bind:this={root} class={styles.proximityTextRoot} style={ROOT_STYLE}>
    <div
        bind:this={container}
        class={getIsDriven() ? undefined : styles.proximityTextChildrenWrap}
        aria-hidden={getIsDriven() ? undefined : "true"}
        inert={!getIsDriven()}
    >
        {@render props.children?.()}
    </div>

    {#if !getIsDriven() && getSegments().length > 0}
        <div class={styles.proximityTextLines} style:width={`${getWidth() ?? 0}px`}>
            {#each getSegments() as segment, index (index)}
                {@render segmentView(segment, false)}
            {/each}
        </div>

        <div
            bind:this={rest}
            class={styles.proximityTextRestLines}
            style:width={`${getWidth() ?? 0}px`}
            aria-hidden="true"
        >
            {#each getSegments() as segment, index (index)}
                {@render segmentView(segment, true)}
            {/each}
        </div>
    {/if}
</div>
