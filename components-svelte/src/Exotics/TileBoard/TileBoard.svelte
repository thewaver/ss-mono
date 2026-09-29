<script lang="ts">
    import { untrack } from "svelte";
    import { on } from "svelte/events";

    import {
        TILE_BOARD_DEFAULTS,
        type InteractionFlags,
        type TileBoardRenderProps,
        TileBoardUtils,
        TileBoardStyles as styles,
    } from "@thewaver/ss-components";
    import { Index2d } from "@thewaver/ss-utils";

    import InteractionWrapper from "../../Primitives/InteractionWrapper/InteractionWrapper.svelte";
    import type { TileBoardProps } from "./TileBoard.types.js";
    import TileBoardTile from "./TileBoardTile.svelte";

    const FIRST_ARIA_INDEX = 1;

    let props: TileBoardProps = $props();

    const boardId = $props.id();
    const tileRefs = new Map<string, HTMLElement>();

    let root = $state<HTMLDivElement>();
    let highlighted = $state.raw<Index2d>(TileBoardUtils.getFirstTile());

    const gap = $derived(props.gap ?? TILE_BOARD_DEFAULTS.gap);
    const tileShape = $derived(props.tileShape ?? TILE_BOARD_DEFAULTS.tileShape);
    const hasShortFirstRow = $derived(props.hasShortFirstRow ?? false);
    const taper = $derived(props.taper ?? TILE_BOARD_DEFAULTS.taper);
    const isDisabled = $derived(props.isDisabled ?? false);

    const tileSize = $derived(TileBoardUtils.getTileBoxSize(props.tileSize, gap));

    const layout = $derived(
        TileBoardUtils.getLayout(tileShape, props.tileCount, props.tileSize, hasShortFirstRow, taper),
    );

    const boardSize = $derived(TileBoardUtils.getBoardSize(layout));

    const points = $derived(TileBoardUtils.getTilePoints(layout.shape, tileSize, false));
    const flippedPoints = $derived(TileBoardUtils.getTilePoints(layout.shape, tileSize, true));

    const clipPath = $derived(TileBoardUtils.getClipPath(points));
    const flippedClipPath = $derived(TileBoardUtils.getClipPath(flippedPoints));

    const getIsTileDisabled = (tile: Index2d) => isDisabled || (props.computeIsTileDisabled?.(tile) ?? false);

    const rovingTile = $derived(TileBoardUtils.clampTile(highlighted, layout));
    const rovingKey = $derived(Index2d.toString(rovingTile));

    const isSweepable = $derived(props.onTileSweep !== undefined && !isDisabled);

    const sweeper = TileBoardUtils.createSweeper({
        getIsSweepable: () => isSweepable,
        getIsTileDisabled,
        onSweep: (tile) => props.onTileSweep?.(tile),
    });

    $effect(() => {
        const board = root;

        if (!board) return;

        board.addEventListener("click", sweeper.swallowClick, true);

        return () => {
            board.removeEventListener("click", sweeper.swallowClick, true);
            sweeper.stop();
        };
    });

    $effect(() => {
        const key = rovingKey;

        untrack(() => {
            if (!root?.contains(document.activeElement) || root === document.activeElement) return;

            tileRefs.get(key)?.focus();
        });
    });

    const moveTo = (tile: Index2d) => {
        highlighted = TileBoardUtils.clampTile(tile, layout);
    };

    const activateTile = (tile: Index2d) => {
        if (getIsTileDisabled(tile)) return;

        moveTo(tile);
        props.onTileActivate(tile);
    };

    const handleKeyDown = (e: KeyboardEvent) => {
        const action = TileBoardUtils.computeKeyAction(e.key, e.ctrlKey || e.metaKey, rovingTile, layout);

        if (action === undefined) return;

        e.preventDefault();

        if (action.kind === "activate") activateTile(rovingTile);
        else moveTo(action.tile);
    };

    const setTileRef = (key: string, element: HTMLElement | undefined) => {
        if (element) tileRefs.set(key, element);
        else tileRefs.delete(key);
    };
</script>

{#snippet tileAt(row: number, col: number)}
    {@const tile = { row, col }}
    {@const key = Index2d.toString(tile)}
    {@const isFlipped = TileBoardUtils.getIsFlippedTile(tile, layout)}
    {@const isRoving = Index2d.isSame(tile, rovingTile)}
    <div class={styles.tileBoardCell} role="presentation" style:left={`${col * layout.pitch.width}px`}>
        <InteractionWrapper
            isDisabled={getIsTileDisabled(tile)}
            isFocusableWhenDisabled={!isDisabled}
            isTabbable={isRoving}
            extraFlags={{
                tile,
                size: tileSize,
                points: isFlipped ? flippedPoints : points,
                isFlipped,
                isHighlighted: isRoving,
            }}
            bind:ref={() => tileRefs.get(key), (element) => setTileRef(key, element)}
        >
            {#snippet renderControl(attachElement, flags)}
                {#snippet tileContent(tileFlags: InteractionFlags<TileBoardRenderProps>)}
                    {@render props.renderTile(tile, tileFlags)}
                {/snippet}
                <TileBoardTile
                    {attachElement}
                    id={`${boardId}-tile-${key}`}
                    {flags}
                    ariaLabel={props.computeTileAriaLabel?.(tile)}
                    colIndex={col + FIRST_ARIA_INDEX}
                    size={tileSize}
                    clipPath={isFlipped ? flippedClipPath : clipPath}
                    renderContent={tileContent}
                    onActivate={() => activateTile(tile)}
                    attachHit={(element) => sweeper.addHitLayer(element, tile)}
                />
            {/snippet}
        </InteractionWrapper>
    </div>
{/snippet}

<div
    bind:this={root}
    {@attach (element) => on(element, "keydown", handleKeyDown)}
    {@attach (element) => on(element, "pointerdown", (e) => sweeper.press(e))}
    id={boardId}
    class={[styles.tileBoardRoot, isSweepable && styles.tileBoardIsSweepable]}
    role="grid"
    aria-label={props.ariaLabel}
    aria-rowcount={layout.count.row}
    aria-colcount={layout.count.col}
    aria-disabled={isDisabled || undefined}
    style:width={`${boardSize.width}px`}
    style:height={`${boardSize.height}px`}
>
    <div class={styles.tileBoardPlane} style:transform={TileBoardUtils.getTaperTransform(layout)}>
        {#each { length: Math.max(layout.count.row, 0) }, rowIndex}
            {@const origin = TileBoardUtils.getRowOrigin(rowIndex, layout, gap)}
            <div
                class={styles.tileBoardRow}
                role="row"
                aria-rowindex={rowIndex + FIRST_ARIA_INDEX}
                style:left={`${origin.x}px`}
                style:top={`${origin.y}px`}
            >
                {#each { length: TileBoardUtils.getRowLength(rowIndex, layout) }, colIndex}
                    {@render tileAt(rowIndex, colIndex)}
                {/each}
            </div>
        {/each}
    </div>
</div>
