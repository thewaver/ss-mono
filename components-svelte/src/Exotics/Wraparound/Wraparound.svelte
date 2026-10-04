<script lang="ts">
    import { untrack } from "svelte";

    import {
        WRAPAROUND_DEFAULTS,
        type WraparoundTile,
        WraparoundUtils,
        WraparoundStyles as styles,
    } from "@thewaver/ss-components";

    import { ElementObserverSvelteUtils } from "../../Abstracts/ElementObserver/ElementObserverSvelte.utils.svelte.js";
    import { InteractionTrackerSvelteUtils } from "../../Abstracts/InteractionTracker/InteractionTrackerSvelte.utils.svelte.js";
    import { readStore } from "../../Utils/storeUtils.js";
    import type { WraparoundProps } from "./Wraparound.types.js";

    const KEY_SEPARATOR = ",";

    const toKey = (tile: WraparoundTile) => `${tile.column}${KEY_SEPARATOR}${tile.row}`;

    const fromKey = (key: string): WraparoundTile => {
        const [column, row] = key.split(KEY_SEPARATOR).map(Number);

        return { column, row };
    };

    let { playback = $bindable(true), ...props }: WraparoundProps = $props();

    let root = $state<HTMLDivElement>();
    let original = $state<HTMLDivElement>();

    const getViewportSize = ElementObserverSvelteUtils.createBorderBoxSizeObserver(() => root ?? undefined);
    const getTileSize = ElementObserverSvelteUtils.createBorderBoxSizeObserver(() => original ?? undefined);

    const isDisabled = $derived(props.isDisabled ?? false);
    const isMovable = $derived(props.isMovable ?? WRAPAROUND_DEFAULTS.isMovable);
    const maxCopies = $derived(props.maxCopies ?? WRAPAROUND_DEFAULTS.maxCopies);
    const driftPxPerSecond = $derived(props.driftPxPerSecond ?? WRAPAROUND_DEFAULTS.driftPxPerSecond);
    const driftDegrees = $derived(props.driftDegrees ?? WRAPAROUND_DEFAULTS.driftDegrees);

    const getIsHeld = InteractionTrackerSvelteUtils.trackHold(() => root);

    const isDrifting = $derived(playback && !getIsHeld() && !isDisabled);

    const plane = WraparoundUtils.createPlane({
        getTileSize: () => untrack(getTileSize),
        getViewportSize: () => untrack(getViewportSize),
        getOriginal: () => untrack(() => original ?? undefined),
        getIsDisabled: () => untrack(() => isDisabled),
        getIsMovable: () => untrack(() => isMovable),
        getMomentumMs: () => untrack(() => props.momentumMs ?? WRAPAROUND_DEFAULTS.momentumMs),
        getGlideDurationMs: () => untrack(() => props.glideDurationMs ?? WRAPAROUND_DEFAULTS.glideDurationMs),
        getKeyStepPx: () => untrack(() => props.keyStepPx ?? WRAPAROUND_DEFAULTS.keyStepPx),
    });

    $effect(() => plane.destroy);

    $effect(() => {
        const element = root;

        if (!element) return;

        return untrack(() => plane.observe(element));
    });

    $effect(() => {
        plane.setDrift(isDrifting ? WraparoundUtils.computeDriftVelocity(driftPxPerSecond, driftDegrees) : undefined);
    });

    const getOffset = readStore(plane, (state) => state.offset);
    const getOriginalTile = readStore(plane, (state) => state.original);
    const getIsDragging = readStore(plane, (state) => state.isDragging);

    let lastCopyKeys: string[] = [];

    const copyKeys = $derived.by(() => {
        const keys = WraparoundUtils.computeTiles(getOffset(), getTileSize(), getViewportSize(), maxCopies).map(toKey);
        const isSame =
            keys.length === lastCopyKeys.length && keys.every((key, index) => key === lastCopyKeys[index]);

        if (!isSame) lastCopyKeys = keys;

        return lastCopyKeys;
    });

    const toTileTransform = (tile: WraparoundTile) => {
        const size = getTileSize();

        return `translate(${tile.column * size.width}px, ${tile.row * size.height}px)`;
    };
</script>

<div
    bind:this={root}
    class={[styles.wraparoundRoot, getIsDragging() && styles.isDragging, !isMovable && styles.isImmovable]}
    role="region"
    aria-label={props.ariaLabel}
    tabindex={isDisabled || !isMovable ? undefined : 0}
>
    <div class={styles.wraparoundPlane} style:transform={`translate(${getOffset().x}px, ${getOffset().y}px)`}>
        <div bind:this={original} class={styles.wraparoundTile} style:transform={toTileTransform(getOriginalTile())}>
            {@render props.renderContent()}
        </div>

        {#each copyKeys as key (key)}
            <div
                class={styles.wraparoundTile}
                style:transform={toTileTransform(fromKey(key))}
                style:visibility={key === toKey(getOriginalTile()) ? "hidden" : undefined}
                aria-hidden="true"
                inert
            >
                {@render props.renderContent()}
            </div>
        {/each}
    </div>
</div>
