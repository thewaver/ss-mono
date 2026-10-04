<script lang="ts">
    import { untrack } from "svelte";

    import {
        WRAPAROUND_DEFAULTS,
        type WraparoundTile,
        WraparoundUtils,
        WraparoundStyles as styles,
    } from "@thewaver/ss-components";

    import { ElementObserverSvelteUtils } from "../../Abstracts/ElementObserver/ElementObserverSvelte.utils.svelte.js";
    import { readStore } from "../../Utils/storeUtils.js";
    import type { WraparoundProps } from "./Wraparound.types.js";

    const KEY_SEPARATOR = ",";

    const toKey = (tile: WraparoundTile) => `${tile.column}${KEY_SEPARATOR}${tile.row}`;

    const fromKey = (key: string): WraparoundTile => {
        const [column, row] = key.split(KEY_SEPARATOR).map(Number);

        return { column, row };
    };

    let props: WraparoundProps = $props();

    let root = $state<HTMLDivElement>();
    let original = $state<HTMLDivElement>();

    const getViewportSize = ElementObserverSvelteUtils.createBorderBoxSizeObserver(() => root ?? undefined);
    const getTileSize = ElementObserverSvelteUtils.createBorderBoxSizeObserver(() => original ?? undefined);

    const isDisabled = $derived(props.isDisabled ?? false);
    const maxCopies = $derived(props.maxCopies ?? WRAPAROUND_DEFAULTS.maxCopies);

    const plane = WraparoundUtils.createPlane({
        getTileSize: () => untrack(getTileSize),
        getViewportSize: () => untrack(getViewportSize),
        getOriginal: () => untrack(() => original ?? undefined),
        getIsDisabled: () => untrack(() => isDisabled),
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

    const getOffset = readStore(plane, (state) => state.offset);
    const getOriginalTile = readStore(plane, (state) => state.original);
    const getIsDragging = readStore(plane, (state) => state.isDragging);

    let lastCopyKeys: string[] = [];

    const copyKeys = $derived.by(() => {
        const keys = WraparoundUtils.computeTiles(
            getOffset(),
            getTileSize(),
            getViewportSize(),
            getOriginalTile(),
            maxCopies,
        ).map(toKey);
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
    class={[styles.wraparoundRoot, getIsDragging() && styles.isDragging]}
    role="region"
    aria-label={props.ariaLabel}
    tabindex={isDisabled ? undefined : 0}
>
    <div class={styles.wraparoundPlane} style:transform={`translate(${getOffset().x}px, ${getOffset().y}px)`}>
        <div bind:this={original} class={styles.wraparoundTile} style:transform={toTileTransform(getOriginalTile())}>
            {@render props.renderContent()}
        </div>

        {#each copyKeys as key (key)}
            <div
                class={styles.wraparoundTile}
                style:transform={toTileTransform(fromKey(key))}
                aria-hidden="true"
                inert
            >
                {@render props.renderContent()}
            </div>
        {/each}
    </div>
</div>
