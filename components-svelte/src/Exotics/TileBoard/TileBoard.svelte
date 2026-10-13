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
    import { TileBoardConst } from "@thewaver/ss-components/internal";
    import { Index2d } from "@thewaver/ss-utils";

    import InteractionWrapper from "../../Primitives/InteractionWrapper/InteractionWrapper.svelte";
    import type { TileBoardProps } from "./TileBoard.types.js";
    import TileBoardTile from "./TileBoardTile.svelte";

    let props: TileBoardProps = $props();

    const boardId = $props.id();
    const tileRefs = new Map<string, HTMLElement>();

    let root = $state<HTMLDivElement>();
    let highlighted = $state.raw<Index2d>(TileBoardUtils.getFirstTile());

    const gap = $derived(props.gap ?? TILE_BOARD_DEFAULTS.gap);
    const tiling = $derived(props.tiling ?? TILE_BOARD_DEFAULTS.tiling);
    const hasShortFirstRow = $derived(props.hasShortFirstRow ?? false);
    const taper = $derived(props.taper ?? TILE_BOARD_DEFAULTS.taper);
    const isDisabled = $derived(props.isDisabled ?? false);

    const layout = $derived(
        TileBoardUtils.getLayout(tiling, props.tileCount, props.tileSize, hasShortFirstRow, taper),
    );

    const boardSize = $derived(TileBoardUtils.getBoardSize(layout));

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
    {@const geometry = TileBoardUtils.getTileGeometry(tile, layout, gap)}
    {@const isRoving = Index2d.isSame(tile, rovingTile)}
    <div
        class={styles.tileBoardCell}
        role="presentation"
        style:left={`${geometry.offset.x}px`}
        style:top={`${geometry.offset.y}px`}
    >
        <InteractionWrapper
            isDisabled={getIsTileDisabled(tile)}
            isFocusableWhenDisabled={!isDisabled}
            isTabbable={isRoving}
            extraFlags={{
                tile,
                size: geometry.size,
                points: geometry.points,
                isFlipped: geometry.isFlipped,
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
                    colIndex={col + TileBoardConst.FIRST_ARIA_INDEX}
                    size={geometry.size}
                    clipPath={TileBoardUtils.getClipPath(geometry.points)}
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
    aria-colcount={TileBoardUtils.getColumnCount(layout)}
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
                aria-rowindex={rowIndex + TileBoardConst.FIRST_ARIA_INDEX}
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
